import { Bell, Building2, ChevronDown, CircleHelp, FileClock, Home, LayoutDashboard, Map, Menu, Plus, UsersRound, Vote, X } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useGetDashboard, useHealthCheck } from '@workspace/api-client-react';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/proposals', label: 'Proposals', icon: Vote },
  { href: '/members', label: 'Members', icon: UsersRound },
  { href: '/households', label: 'Households', icon: Home },
  { href: '/signals', label: 'Civic record', icon: FileClock },
  { href: '/neighbourhoods', label: 'Neighbourhoods', icon: Map },
];

export function Initials({ value, tone = 'teal' }: { value: string; tone?: 'teal' | 'saffron' | 'plum' | 'coral' }) {
  const tones = {
    teal: 'bg-[hsl(167_58%_35%)] text-[hsl(40_33%_97%)]',
    saffron: 'bg-[hsl(35_70%_57%)] text-[hsl(255_20%_18%)]',
    plum: 'bg-[hsl(255_20%_32%)] text-[hsl(39_36%_94%)]',
    coral: 'bg-[hsl(7_63%_46%)] text-[hsl(40_33%_97%)]',
  };
  return <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tracking-wide ${tones[tone]}`} data-testid={`avatar-${value}`}>{value}</span>;
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: 'bg-[hsl(167_58%_35%/0.12)] text-[hsl(167_58%_28%)]',
    passed: 'bg-[hsl(35_70%_57%/0.22)] text-[hsl(255_20%_18%)]',
    closed: 'bg-[hsl(38_25%_89%)] text-[hsl(255_10%_43%)]',
    active: 'bg-[hsl(167_58%_35%/0.12)] text-[hsl(167_58%_28%)]',
    invited: 'bg-[hsl(35_70%_57%/0.22)] text-[hsl(255_20%_18%)]',
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] ${styles[status] ?? styles.closed}`} data-testid={`status-${status}`}>{status}</span>;
}

export function formatDate(value: string | null | undefined, withYear = false) {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', ...(withYear ? { year: 'numeric' } : {}) }).format(date);
}

export function PageLoader() {
  return <div className="space-y-5" aria-label="Loading content" data-testid="loading-state">
    <div className="skeleton h-9 w-56 rounded-lg" />
    <div className="grid gap-4 md:grid-cols-3"><div className="skeleton h-28 rounded-2xl" /><div className="skeleton h-28 rounded-2xl" /><div className="skeleton h-28 rounded-2xl" /></div>
    <div className="skeleton h-64 rounded-2xl" />
  </div>;
}

export function ErrorState({ message = 'We could not load this part of Civium.' }: { message?: string }) {
  return <div className="rounded-2xl border border-[hsl(7_63%_46%/0.25)] bg-[hsl(7_63%_46%/0.06)] p-6" data-testid="error-state">
    <p className="text-sm font-semibold text-[hsl(7_63%_40%)]">A small civic snag</p>
    <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    <p className="mt-3 text-xs text-muted-foreground">Try refreshing the page, or come back in a moment.</p>
  </div>;
}

export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return <div className="civic-grid rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center" data-testid="empty-state">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary"><Building2 size={20} /></div>
    <h3 className="serif mt-4 text-xl">{title}</h3>
    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{detail}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>;
}

export function CiviumShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const health = useHealthCheck();
  const dashboard = useGetDashboard();
  const neighbourhood = dashboard.data?.neighbourhood;
  const isHealthy = health.data?.status === 'ok' || health.data?.status === 'healthy';

  return <div className="min-h-[100dvh] bg-background">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-sidebar px-5 py-6 text-sidebar-foreground transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between px-2">
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3" data-testid="link-brand">
          <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-sidebar-primary text-sidebar-primary-foreground"><span className="serif text-lg">C</span></span>
          <span className="serif text-[22px] tracking-[-.03em]">civium</span>
        </Link>
        <button className="rounded-lg p-2 text-sidebar-foreground/70 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation"><X size={18} /></button>
      </div>
      <div className="mt-12 px-2 text-[10px] font-bold uppercase tracking-[.2em] text-sidebar-foreground/40">Your neighbourhood</div>
      <div className="mt-3 flex items-center gap-3 rounded-xl bg-sidebar-accent px-3 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">{neighbourhood?.initials ?? '—'}</span>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{neighbourhood?.name ?? 'Your neighbourhood'}</p><p className="text-xs text-sidebar-foreground/55">{neighbourhood?.city ?? 'Local community'}</p></div>
        <ChevronDown size={15} className="text-sidebar-foreground/45" />
      </div>
      <nav className="mt-8 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const active = item.href === '/' ? location === '/' : location.startsWith(item.href);
          const Icon = item.icon;
          return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`} data-testid={`link-nav-${item.label.toLowerCase()}`}>
            <Icon size={17} strokeWidth={active ? 2.4 : 1.8} /><span>{item.label}</span>
            {item.href === '/proposals' && <span className={`ml-auto h-5 min-w-5 rounded-full px-1.5 text-center text-[10px] leading-5 ${active ? 'bg-sidebar-primary-foreground/20' : 'bg-sidebar-accent'}`}>3</span>}
          </Link>;
        })}
      </nav>
      <div className="mt-auto space-y-1">
        <Link href="/proposals?create=true" className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-sidebar-primary px-3 py-3 text-sm font-bold text-sidebar-primary-foreground transition-transform hover:-translate-y-0.5" data-testid="link-create-proposal"><Plus size={16} /> Start a proposal</Link>
        <a href="#help" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground" data-testid="link-help"><CircleHelp size={17} /> Help &amp; guidance</a>
        <div className="flex items-center gap-2 px-3 pt-4 text-[10px] text-sidebar-foreground/40"><span className={`h-1.5 w-1.5 rounded-full ${isHealthy ? 'bg-[hsl(167_58%_45%)]' : health.isLoading ? 'bg-sidebar-primary animate-pulse' : 'bg-[hsl(7_63%_55%)]'}`} /> {health.isLoading ? 'Checking connection' : isHealthy ? 'Civium is live' : 'Connection needs attention'}</div>
      </div>
    </aside>
    {mobileOpen && <button className="fixed inset-0 z-30 bg-[hsl(255_20%_18%/0.5)] md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu overlay" data-testid="button-close-menu-overlay" />}
    <div className="md:pl-[258px]">
      <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/90 px-5 backdrop-blur md:px-10">
        <button className="rounded-xl p-2 text-muted-foreground hover:bg-muted md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation" data-testid="button-open-navigation"><Menu size={21} /></button>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Tuesday, 14 May 2024 <span className="mx-1 text-border">/</span> {neighbourhood?.name ?? 'Your neighbourhood'}</div>
        <div className="ml-auto flex items-center gap-3">
          <button className="relative rounded-xl p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Notifications" data-testid="button-notifications"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[hsl(7_63%_46%)]" /></button>
          <div className="hidden h-7 w-px bg-border sm:block" />
          <div className="flex items-center gap-2.5"><Initials value="AS" tone="saffron" /><div className="hidden text-left sm:block"><p className="text-xs font-bold">Alex Singh</p><p className="text-[10px] text-muted-foreground">Resident</p></div></div>
        </div>
      </header>
      <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">{children}</main>
    </div>
  </div>;
}