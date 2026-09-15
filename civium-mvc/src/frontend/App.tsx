import React from 'react';
import { HouseholdDashboard } from './components/HouseholdDashboard';
import { NeighbourhoodDashboard } from './components/NeighbourhoodDashboard';
import { CivicPanel } from './components/CivicPanel';
import { IdentityPanel } from './components/IdentityPanel';

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Civium MVC</h1>

      <HouseholdDashboard />
      <NeighbourhoodDashboard />
      <CivicPanel />
      <IdentityPanel />
    </div>
  );
}
