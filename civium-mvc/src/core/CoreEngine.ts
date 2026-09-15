import {
  Person,
  Household,
  Neighbourhood,
  CivicSignal
} from './types';

import { IdentityEngine } from './IdentityEngine';
import { LegitimacyEngine } from './LegitimacyEngine';
import { NeighbourhoodEngine } from './NeighbourhoodEngine';
import { TierEngine } from './TierEngine';

export class CoreEngine {
  private identity = new IdentityEngine();
  private legitimacy = new LegitimacyEngine();
  private neighbourhoods = new NeighbourhoodEngine();
  private tiers = new TierEngine();

  registerPerson(name: string, householdId: string): Person {
    const person: Person = {
      id: crypto.randomUUID(),
      name,
      householdId,
      identityToken: '',
      legitimacyScore: 50,
      tier: 'HOUSEHOLD'
    };

    person.identityToken = this.identity.generateIdentityToken(person);
    person.tier = this.tiers.assignTierToPerson(person);

    return person;
  }

  createHousehold(address: string): Household {
    return {
      id: crypto.randomUUID(),
      address,
      members: [],
      legitimacyScore: 60
    };
  }

  joinNeighbourhood(household: Household, neighbourhood: Neighbourhood): Neighbourhood {
    return this.neighbourhoods.addHousehold(neighbourhood, household);
  }

  routeSignal(signal: CivicSignal): void {
    // Minimal routing logic
    if (signal.neighbourhoodId) {
      console.log(`Routing signal to neighbourhood ${signal.neighbourhoodId}`);
    } else if (signal.householdId) {
      console.log(`Routing signal to household ${signal.householdId}`);
    } else {
      console.log(`Signal has no destination`);
    }
  }

  updateLegitimacy(person: Person, household: Household, neighbourhood: Neighbourhood, signals: CivicSignal[]) {
    person.legitimacyScore = this.legitimacy.calculatePersonScore(person.id, signals).score;
    household.legitimacyScore = this.legitimacy.calculateHouseholdScore(household.id, signals).score;
    neighbourhood.legitimacyScore = this.legitimacy.calculateNeighbourhoodScore(neighbourhood.id, signals).score;
  }

  async updateLegitimacyFlow(
    personId: string,
    householdId: string,
    neighbourhoodId: string,
    signals: CivicSignal[]
  ) {
    const personScore = this.legitimacy.calculatePersonScore(personId, signals);
    const householdScore = this.legitimacy.calculateHouseholdScore(householdId, signals);
    const neighbourhoodScore = this.legitimacy.calculateNeighbourhoodScore(neighbourhoodId, signals);

    return {
      personScore,
      householdScore,
      neighbourhoodScore
    };
  }
}
