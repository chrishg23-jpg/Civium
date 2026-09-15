import { CivicSignal, LegitimacyScore } from './types';

export class LegitimacyEngine {
  calculatePersonScore(personId: string, signals: CivicSignal[]): LegitimacyScore {
    const participation = signals.filter(s => s.fromPersonId === personId).length;
    const helpfulness = signals.filter(s => s.type === 'REQUEST').length;
    const nonHarm = signals.filter(s => s.type === 'REPORT').length;

    const score = Math.min(100, 50 + participation * 2 + helpfulness - nonHarm);

    return {
      entityId: personId,
      entityType: 'PERSON',
      score,
      lastUpdated: new Date()
    };
  }

  calculateHouseholdScore(householdId: string, signals: CivicSignal[]): LegitimacyScore {
    const householdSignals = signals.filter(s => s.householdId === householdId);
    const score = Math.min(100, 60 + householdSignals.length);

    return {
      entityId: householdId,
      entityType: 'HOUSEHOLD',
      score,
      lastUpdated: new Date()
    };
  }

  calculateNeighbourhoodScore(neighbourhoodId: string, signals: CivicSignal[]): LegitimacyScore {
    const neighbourhoodSignals = signals.filter(s => s.neighbourhoodId === neighbourhoodId);
    const score = Math.min(100, 70 + neighbourhoodSignals.length * 0.5);

    return {
      entityId: neighbourhoodId,
      entityType: 'NEIGHBOURHOOD',
      score,
      lastUpdated: new Date()
    };
  }
}
