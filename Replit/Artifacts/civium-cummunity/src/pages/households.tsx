import { Building2, Check, Home, Plus, UsersRound, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getListHouseholdsQueryKey, useCreateHousehold, useListHouseholds, useListNeighbourhoods } from '@workspace/api-client-react';
import { EmptyState, ErrorState, PageLoader } from '@/components/civium-shell';

export default function HouseholdsPage() {
  const queryClient = useQueryClient();
  const households = useListHouseholds();
  const neighbourhoods = useListNeighbourhoods();
  const create = useCreateHousehold();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', neighbourhoodId: '' });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    create.mutate({ data: { name: form.name, neighbourhoodId: Number(form.neighbourhoodId) } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListHouseholdsQueryKey() });
        setForm({ name: '', neighbourhoodId: '' });
        setShowCreate(false);
      },
    });
  }

  return <div className="space-y-8">
    <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-accent">The household layer</p><h1 className="serif mt-2 text-4xl tracking-[-.04em] md:text-5xl">Households</h1><p className="mt-3 max-w-xl text-[15px] leading-7 text-muted-foreground">Connect residents to the homes and shared contexts that make neighbourhood participation practical.</p></div>
      <button onClick={() => setShowCreate(true)} className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="button-open-create-household"><Plus size={16} /> Add a household</button>
    </section>
    <div className="rounded-2xl border border-border bg-secondary/50 p-5 md:flex md:items-center md:gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-accent"><Home size={18} /></span><div className="mt-3 md:mt-0"><p className="text-sm font-bold">A household is a membership context, not a score.</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Civium records who shares a civic setting while keeping participation evidence separate from identity.</p></div></div>
    {households.isLoading ? <PageLoader /> : households.isError ? <ErrorState message="The household directory could not be loaded." /> : (households.data ?? []).length === 0 ? <EmptyState title="No households yet" detail="Create the first household, then assign residents from the member directory." action={<button onClick={() => setShowCreate(true)} className="rounded-xl bg-primary px-4 py-3 text-xs font-bold text-primary-foreground">Create a household</button>} /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{households.data?.map((household) => <article key={household.id} className="rounded-2xl border border-border bg-card p-6" data-testid={`card-household-${household.id}`}><div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary"><Building2 size={18} /></span><span className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">{household.neighbourhoodName}</span></div><h2 className="serif mt-6 text-2xl">{household.name}</h2><div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4"><div><p className="flex items-center gap-1.5 text-2xl font-semibold"><UsersRound size={15} className="text-accent" /> {household.memberCount}</p><p className="mt-1 text-xs text-muted-foreground">residents linked</p></div><div><p className="text-2xl font-semibold">{household.participationCount}</p><p className="mt-1 text-xs text-muted-foreground">signals recorded</p></div></div></article>)}</div>}
    {showCreate && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[hsl(255_20%_18%/0.45)] p-0 backdrop-blur-sm sm:items-center sm:p-5"><div className="w-full max-w-xl rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl sm:p-8" role="dialog" aria-modal="true" aria-labelledby="create-household-title" data-testid="dialog-create-household"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">New membership context</p><h2 id="create-household-title" className="serif mt-1 text-3xl">Add a household</h2></div><button onClick={() => setShowCreate(false)} className="rounded-xl p-2 text-muted-foreground hover:bg-muted" aria-label="Close create household"><X size={18} /></button></div><form onSubmit={submit} className="mt-7 space-y-5"><label className="block"><span className="text-xs font-bold">Household name</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-accent" placeholder="e.g. The Patel household" data-testid="input-household-name" /></label><label className="block"><span className="text-xs font-bold">Neighbourhood</span><select required value={form.neighbourhoodId} onChange={(event) => setForm({ ...form, neighbourhoodId: event.target.value })} className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-accent" data-testid="select-household-neighbourhood"><option value="">Choose a neighbourhood</option>{(neighbourhoods.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>{create.isError && <p className="text-xs text-[hsl(7_63%_40%)]">We could not create that household. Please try again.</p>}<button disabled={create.isPending || neighbourhoods.isLoading} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-60" data-testid="button-submit-household">{create.isPending ? 'Creating…' : <><Check size={16} /> Create household</>}</button></form></div></div>}
  </div>;
}