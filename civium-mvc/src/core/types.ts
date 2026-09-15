export type UUID = string;

export interface Person {
  id: UUID;
  name: string;
  householdId: UUID;
  identityToken: string;
  legitimacyScore: number; // 0–100
  tier: TierLevel;
}

export interface Household {
  id: UUID;
  address: string;
  members: UUID[];
  neighbourhoodId?: UUID;
  legitimacyScore: number;
}

export interface Neighbourhood {
  id: UUID;
  name: string;
  households: UUID[];
  legitimacyScore: number;
}

export type TierLevel = 'HOUSEHOLD' | 'NEIGHBOURHOOD' | 'COMMUNITY_CLUSTER';

export type CivicSignalType = 'PROPOSAL' | 'VOTE' | 'REQUEST' | 'REPORT';

export interface CivicSignal {
  id: UUID;
  type: CivicSignalType;
  fromPersonId: UUID;
  householdId?: UUID;
  neighbourhoodId?: UUID;
  payload: any;
  createdAt: Date;
}

export interface LegitimacyScore {
  entityId: UUID;
  entityType: 'PERSON' | 'HOUSEHOLD' | 'NEIGHBOURHOOD';
  score: number;
  lastUpdated: Date;
}
