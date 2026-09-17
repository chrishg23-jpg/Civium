import { Router, type IRouter } from "express";
import { and, count, desc, eq } from "drizzle-orm";
import {
  activitiesTable,
  civicSignalsTable,
  db,
  householdsTable,
  membersTable,
  neighbourhoodsTable,
  proposalVotesTable,
  proposalsTable,
} from "@workspace/db";
import {
  AssignMemberHouseholdBody,
  AssignMemberHouseholdParams,
  AssignMemberHouseholdResponse,
  CreateHouseholdBody,
  CreateHouseholdResponse,
  CreateNeighbourhoodBody,
  CreateNeighbourhoodResponse,
  CreateProposalBody,
  CreateProposalResponse,
  CreateSignalBody,
  CreateSignalResponse,
  GetDashboardResponse,
  GetProposalParams,
  GetProposalResponse,
  ListActivitiesResponse,
  ListHouseholdsResponse,
  ListMembersResponse,
  ListProposalsQueryParams,
  ListProposalsResponse,
  ListNeighbourhoodsResponse,
  ListSignalsQueryParams,
  ListSignalsResponse,
  VoteOnProposalBody,
  VoteOnProposalParams,
  VoteOnProposalResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const DEMO_VOTER = "demo-member";

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function asIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

async function proposalResponse(id: number) {
  const [proposal] = await db
    .select()
    .from(proposalsTable)
    .where(eq(proposalsTable.id, id))
    .limit(1);

  if (!proposal) return undefined;

  const [vote] = await db
    .select({ id: proposalVotesTable.id })
    .from(proposalVotesTable)
    .where(and(eq(proposalVotesTable.proposalId, id), eq(proposalVotesTable.voterKey, DEMO_VOTER)))
    .limit(1);

  return {
    id: proposal.id,
    title: proposal.title,
    summary: proposal.summary,
    category: proposal.category,
    status: proposal.status as "open" | "passed" | "closed",
    author: proposal.author,
    authorInitials: proposal.authorInitials,
    createdAt: asIso(proposal.createdAt),
    closesAt: asIso(proposal.closesAt),
    supportCount: proposal.supportCount,
    opposeCount: proposal.opposeCount,
    commentCount: proposal.commentCount,
    hasVoted: Boolean(vote),
  };
}

async function memberResponse(id: number) {
  const [member] = await db
    .select({
      id: membersTable.id,
      name: membersTable.name,
      initials: membersTable.initials,
      role: membersTable.role,
      joinedAt: membersTable.joinedAt,
      contribution: membersTable.contribution,
      status: membersTable.status,
      householdId: membersTable.householdId,
      householdName: householdsTable.name,
    })
    .from(membersTable)
    .leftJoin(householdsTable, eq(membersTable.householdId, householdsTable.id))
    .where(eq(membersTable.id, id))
    .limit(1);

  return member ? { ...member, joinedAt: asIso(member.joinedAt), status: member.status as "active" | "invited" } : undefined;
}

async function householdResponse(id: number) {
  const [household] = await db
    .select({
      id: householdsTable.id,
      name: householdsTable.name,
      neighbourhoodId: householdsTable.neighbourhoodId,
      neighbourhoodName: neighbourhoodsTable.name,
      memberCount: householdsTable.memberCount,
      participationCount: householdsTable.participationCount,
    })
    .from(householdsTable)
    .innerJoin(neighbourhoodsTable, eq(householdsTable.neighbourhoodId, neighbourhoodsTable.id))
    .where(eq(householdsTable.id, id))
    .limit(1);

  return household;
}

function signalResponse(signal: typeof civicSignalsTable.$inferSelect) {
  return {
    id: signal.id,
    type: signal.type as "proposal" | "vote" | "request" | "report",
    title: signal.title,
    summary: signal.summary,
    actor: signal.actor,
    actorInitials: signal.actorInitials,
    neighbourhoodId: signal.neighbourhoodId,
    proposalId: signal.proposalId,
    createdAt: asIso(signal.createdAt),
  };
}

router.get("/dashboard", async (_req, res): Promise<void> => {
  const [neighbourhood] = await db
    .select()
    .from(neighbourhoodsTable)
    .orderBy(neighbourhoodsTable.id)
    .limit(1);

  if (!neighbourhood) {
    res.status(404).json({ error: "No neighbourhood has been created yet" });
    return;
  }

  const [openResult] = await db
    .select({ value: count() })
    .from(proposalsTable)
    .where(eq(proposalsTable.status, "open"));
  const [memberResult] = await db
    .select({ value: count() })
    .from(membersTable)
    .where(eq(membersTable.status, "active"));
  const [voteResult] = await db.select({ value: count() }).from(proposalVotesTable);
  const [nextProposal] = await db
    .select({ closesAt: proposalsTable.closesAt })
    .from(proposalsTable)
    .where(eq(proposalsTable.status, "open"))
    .orderBy(proposalsTable.closesAt)
    .limit(1);

  const activeMembers = Number(memberResult?.value ?? 0);
  const totalVotes = Number(voteResult?.value ?? 0);
  const participationRate = activeMembers === 0
    ? 0
    : Math.min(100, Math.round((totalVotes / activeMembers) * 100));

  const response = {
    neighbourhood,
    openProposals: Number(openResult?.value ?? 0),
    activeMembers,
    participationRate,
    upcomingEvent: "Neighbourhood assembly · Saturday, 10:00",
    nextDecisionDate: nextProposal ? asIso(nextProposal.closesAt) : null,
  };

  res.json(GetDashboardResponse.parse(response));
});

router.get("/neighbourhoods", async (_req, res): Promise<void> => {
  const neighbourhoods = await db
    .select()
    .from(neighbourhoodsTable)
    .orderBy(desc(neighbourhoodsTable.id));
  res.json(ListNeighbourhoodsResponse.parse(neighbourhoods));
});

router.post("/neighbourhoods", async (req, res): Promise<void> => {
  const parsed = CreateNeighbourhoodBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [neighbourhood] = await db
    .insert(neighbourhoodsTable)
    .values({
      ...parsed.data,
      initials: initialsFor(parsed.data.name),
    })
    .returning();

  res.status(201).json(CreateNeighbourhoodResponse.parse(neighbourhood));
});

router.get("/proposals", async (req, res): Promise<void> => {
  const query = ListProposalsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const proposals = await db
    .select()
    .from(proposalsTable)
    .where(query.data.status ? eq(proposalsTable.status, query.data.status) : undefined)
    .orderBy(desc(proposalsTable.createdAt));
  const response = await Promise.all(proposals.map((proposal) => proposalResponse(proposal.id)));
  res.json(ListProposalsResponse.parse(response.filter(Boolean)));
});

router.post("/proposals", async (req, res): Promise<void> => {
  const parsed = CreateProposalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const closesAt = new Date(parsed.data.closesAt);
  if (Number.isNaN(closesAt.getTime())) {
    res.status(400).json({ error: "closesAt must be a valid date" });
    return;
  }

  const [proposal] = await db
    .insert(proposalsTable)
    .values({
      title: parsed.data.title,
      summary: parsed.data.summary,
      category: parsed.data.category,
      closesAt,
      author: "You",
      authorInitials: "YO",
      status: "open",
    })
    .returning();

  await db.insert(activitiesTable).values({
    type: "proposal",
    actor: "You",
    actorInitials: "YO",
    text: `opened a new proposal: ${proposal.title}`,
    accent: "violet",
  });

  const [neighbourhood] = await db
    .select({ id: neighbourhoodsTable.id })
    .from(neighbourhoodsTable)
    .orderBy(neighbourhoodsTable.id)
    .limit(1);
  if (neighbourhood) {
    await db.insert(civicSignalsTable).values({
      type: "proposal",
      title: proposal.title,
      summary: proposal.summary,
      actor: "You",
      actorInitials: "YO",
      neighbourhoodId: neighbourhood.id,
      proposalId: proposal.id,
    });
  }

  const response = await proposalResponse(proposal.id);
  res.status(201).json(CreateProposalResponse.parse(response));
});

router.get("/proposals/:id", async (req, res): Promise<void> => {
  const params = GetProposalParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const proposal = await proposalResponse(params.data.id);
  if (!proposal) {
    res.status(404).json({ error: "Proposal not found" });
    return;
  }

  res.json(GetProposalResponse.parse(proposal));
});

router.post("/proposals/:id", async (req, res): Promise<void> => {
  const params = VoteOnProposalParams.safeParse(req.params);
  const body = VoteOnProposalBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [proposal] = await db
    .select()
    .from(proposalsTable)
    .where(eq(proposalsTable.id, params.data.id))
    .limit(1);
  if (!proposal) {
    res.status(404).json({ error: "Proposal not found" });
    return;
  }

  const [existingVote] = await db
    .select()
    .from(proposalVotesTable)
    .where(and(eq(proposalVotesTable.proposalId, params.data.id), eq(proposalVotesTable.voterKey, DEMO_VOTER)))
    .limit(1);

  const nextSupport = proposal.supportCount
    - (existingVote?.choice === "support" ? 1 : 0)
    + (body.data.choice === "support" ? 1 : 0);
  const nextOppose = proposal.opposeCount
    - (existingVote?.choice === "oppose" ? 1 : 0)
    + (body.data.choice === "oppose" ? 1 : 0);

  if (existingVote) {
    await db
      .update(proposalVotesTable)
      .set({ choice: body.data.choice })
      .where(eq(proposalVotesTable.id, existingVote.id));
  } else {
    await db.insert(proposalVotesTable).values({
      proposalId: params.data.id,
      choice: body.data.choice,
      voterKey: DEMO_VOTER,
    });
  }

  await db
    .update(proposalsTable)
    .set({ supportCount: nextSupport, opposeCount: nextOppose })
    .where(eq(proposalsTable.id, params.data.id));

  await db.insert(activitiesTable).values({
    type: "vote",
    actor: "You",
    actorInitials: "YO",
    text: `${body.data.choice === "support" ? "supported" : "opposed"} "${proposal.title}"`,
    accent: body.data.choice === "support" ? "teal" : "amber",
  });

  const [neighbourhood] = await db
    .select({ id: neighbourhoodsTable.id })
    .from(neighbourhoodsTable)
    .orderBy(neighbourhoodsTable.id)
    .limit(1);
  if (neighbourhood) {
    await db.insert(civicSignalsTable).values({
      type: "vote",
      title: body.data.choice === "support" ? "Supported a proposal" : "Opposed a proposal",
      summary: `"${proposal.title}"`,
      actor: "You",
      actorInitials: "YO",
      neighbourhoodId: neighbourhood.id,
      proposalId: proposal.id,
      metadata: { choice: body.data.choice },
    });
  }

  const response = await proposalResponse(params.data.id);
  res.json(VoteOnProposalResponse.parse(response));
});

router.get("/members", async (_req, res): Promise<void> => {
  const members = await db
    .select({
      id: membersTable.id,
      name: membersTable.name,
      initials: membersTable.initials,
      role: membersTable.role,
      joinedAt: membersTable.joinedAt,
      contribution: membersTable.contribution,
      status: membersTable.status,
      householdId: membersTable.householdId,
      householdName: householdsTable.name,
    })
    .from(membersTable)
    .leftJoin(householdsTable, eq(membersTable.householdId, householdsTable.id))
    .orderBy(desc(membersTable.contribution));
  res.json(ListMembersResponse.parse(members.map((member) => ({ ...member, joinedAt: asIso(member.joinedAt), status: member.status as "active" | "invited" }))));
});

router.post("/members/:id/household", async (req, res): Promise<void> => {
  const params = AssignMemberHouseholdParams.safeParse(req.params);
  const body = AssignMemberHouseholdBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [member] = await db.select().from(membersTable).where(eq(membersTable.id, params.data.id)).limit(1);
  if (!member) {
    res.status(404).json({ error: "Member not found" });
    return;
  }

  if (body.data.householdId !== null) {
    const household = await householdResponse(body.data.householdId);
    if (!household) {
      res.status(404).json({ error: "Household not found" });
      return;
    }
  }

  await db.update(membersTable).set({ householdId: body.data.householdId }).where(eq(membersTable.id, member.id));
  for (const householdId of [member.householdId, body.data.householdId]) {
    if (householdId !== null && householdId !== undefined) {
      const [memberCount] = await db
        .select({ value: count() })
        .from(membersTable)
        .where(eq(membersTable.householdId, householdId));
      await db.update(householdsTable).set({ memberCount: Number(memberCount?.value ?? 0) }).where(eq(householdsTable.id, householdId));
    }
  }

  const response = await memberResponse(member.id);
  res.json(AssignMemberHouseholdResponse.parse(response));
});

router.get("/households", async (_req, res): Promise<void> => {
  const households = await db
    .select({
      id: householdsTable.id,
      name: householdsTable.name,
      neighbourhoodId: householdsTable.neighbourhoodId,
      neighbourhoodName: neighbourhoodsTable.name,
      memberCount: householdsTable.memberCount,
      participationCount: householdsTable.participationCount,
    })
    .from(householdsTable)
    .innerJoin(neighbourhoodsTable, eq(householdsTable.neighbourhoodId, neighbourhoodsTable.id))
    .orderBy(desc(householdsTable.id));
  res.json(ListHouseholdsResponse.parse(households));
});

router.post("/households", async (req, res): Promise<void> => {
  const body = CreateHouseholdBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [neighbourhood] = await db
    .select({ id: neighbourhoodsTable.id })
    .from(neighbourhoodsTable)
    .where(eq(neighbourhoodsTable.id, body.data.neighbourhoodId))
    .limit(1);
  if (!neighbourhood) {
    res.status(404).json({ error: "Neighbourhood not found" });
    return;
  }

  const [household] = await db.insert(householdsTable).values(body.data).returning();
  const response = await householdResponse(household.id);
  res.status(201).json(CreateHouseholdResponse.parse(response));
});

router.get("/activities", async (_req, res): Promise<void> => {
  const activities = await db
    .select()
    .from(activitiesTable)
    .orderBy(desc(activitiesTable.timestamp))
    .limit(12);
  res.json(ListActivitiesResponse.parse(activities.map((activity) => ({
    ...activity,
    timestamp: asIso(activity.timestamp),
    type: activity.type as "proposal" | "vote" | "member" | "meeting" | "decision",
  }))));
});

router.get("/signals", async (req, res): Promise<void> => {
  const query = ListSignalsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const signals = await db
    .select()
    .from(civicSignalsTable)
    .where(query.data.type ? eq(civicSignalsTable.type, query.data.type) : undefined)
    .orderBy(desc(civicSignalsTable.createdAt))
    .limit(40);
  res.json(ListSignalsResponse.parse(signals.map(signalResponse)));
});

router.post("/signals", async (req, res): Promise<void> => {
  const body = CreateSignalBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [neighbourhood] = await db
    .select({ id: neighbourhoodsTable.id })
    .from(neighbourhoodsTable)
    .where(eq(neighbourhoodsTable.id, body.data.neighbourhoodId))
    .limit(1);
  if (!neighbourhood) {
    res.status(404).json({ error: "Neighbourhood not found" });
    return;
  }

  if (body.data.proposalId !== null) {
    const [proposal] = await db.select({ id: proposalsTable.id }).from(proposalsTable).where(eq(proposalsTable.id, body.data.proposalId)).limit(1);
    if (!proposal) {
      res.status(404).json({ error: "Proposal not found" });
      return;
    }
  }

  const [signal] = await db.insert(civicSignalsTable).values({
    ...body.data,
    actor: "You",
    actorInitials: "YO",
  }).returning();
  res.status(201).json(CreateSignalResponse.parse(signalResponse(signal)));
});

export default router;