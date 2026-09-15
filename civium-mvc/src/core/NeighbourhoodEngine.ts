import { Neighbourhood, Household, CivicSignal } from './types';

export class NeighbourhoodEngine {
  createNeighbourhood(name: string): Neighbourhood {
    return {
      id: crypto.randomUUID(),
      name,
      households: [],
      legitimacyScore: 50
    };
  }

  addHousehold(neighbourhood: Neighbourhood, household: Household): Neighbourhood {
    neighbourhood.households.push(household.id);
    return neighbourhood;
  }

  aggregateSignals(neighbourhoodId: string, signals: CivicSignal[]): CivicSignal[] {
    return signals.filter(s => s.neighbourhoodId === neighbourhoodId);
  }
}
