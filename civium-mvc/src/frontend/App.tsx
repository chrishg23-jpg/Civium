import React from 'react';
import './styles.css';
import { HouseholdDashboard } from './components/HouseholdDashboard';
import { IdentityPanel } from './components/IdentityPanel';
import { CivicPanel } from './components/CivicPanel';
import { NeighbourhoodDashboard } from './components/NeighbourhoodDashboard';
import { LookupPanel } from './components/LookupPanel';

export function App() {
  return (
    <div className="app-shell">
      <h1>Civium Core</h1>
      <div className="app-grid">
        <HouseholdDashboard />
        <IdentityPanel />
        <CivicPanel />
        <NeighbourhoodDashboard />
        <LookupPanel />
      </div>
    </div>
  );
}
