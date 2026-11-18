import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CiviumShell } from '@/components/civium-shell';
import DashboardPage from '@/pages/dashboard';
import MembersPage from '@/pages/members';
import HouseholdsPage from '@/pages/households';
import NeighbourhoodsPage from '@/pages/neighbourhoods';
import NotFound from '@/pages/not-found';
import ProposalDetailPage from '@/pages/proposal-detail';
import ProposalsPage from '@/pages/proposals';
import SignalsPage from '@/pages/signals';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <CiviumShell><RoutedErrorBoundary><Switch>
    <Route path="/" component={DashboardPage} />
    <Route path="/proposals" component={ProposalsPage} />
    <Route path="/proposals/:id" component={ProposalDetailPage} />
    <Route path="/members" component={MembersPage} />
    <Route path="/households" component={HouseholdsPage} />
    <Route path="/signals" component={SignalsPage} />
    <Route path="/neighbourhoods" component={NeighbourhoodsPage} />
    <Route component={NotFound} />
  </Switch></RoutedErrorBoundary></CiviumShell>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;