import { Person, Household, Neighbourhood, TierLevel } from './types';

export class TierEngine {
  assignTierToPerson(person: Person): TierLevel {
    return 'HOUSEHOLD';
  }

  assignTierToHousehold(household: Household): TierLevel {
    return 'NEIGHBOURHOOD';
  }

  assignTierToNeighbourhood(neighbourhood: Neighbourhood): TierLevel {
    return 'COMMUNITY_CLUSTER';
  }
}
