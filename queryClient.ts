import { useMemo, useState, type MouseEvent } from "react";
import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { useQuery, QueryClientProvider } from "@tanstack/react-query";
import { Search, SlidersHorizontal, Star, ShoppingBag, X, Moon, Sun, Info, BadgeCheck } from "lucide-react";
import { queryClient } from "./lib/queryClient";
import { CartProvider, makeSelection, useCart } from "./lib/cart";
import { ThemeProvider, useTheme } from "./lib/theme";
import { MOODBOARD, MOODBOARD_KEYS } from "./lib/moodboard";
import { Wordmark } from "./components/Logo";
import { DisclaimerBar, FooterDisclaimer } from "./components/Disclaimer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ClinicianView } from "@shared/schema";

const vibeFilters = ["All", "Cheery", "Clinical", "Aloof", "Retro-Futurist", "Hush", "Precise"];

function Header() {
  const cart = useCart();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur" data-testid="header-main">
      <DisclaimerBar />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a href="#/" aria-label="Loboto-Me home" data-testid="link-home">
          <Wordmark />
        </a>
        <nav className="hidden items-center gap-6 font-mono text-[0.72rem] uppercase tracking-[0.2em] md:flex">
          <a href="#marketplace" data-testid="link-marketplace" onClick={(e) => scrollToId(e, "marketplace")}>Listings</a>
          <a href="#moodboard" data-testid="link-moodboard" onClick={(e) => scrollToId(e, "moodboard")}>Moodboard</a>
          <a href="#concept" data-testid="link-concept" onClick={(e) => scrollToId(e, "concept")}>Concept</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            data-testid="button-theme-toggle"
            className="border-ink"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            onClick={() => cart.setOpen(true)}
            data-testid="button-open-concept-cart"
            className="gap-2 bg-atomic text-atomic-foreground hover:bg-atomic/90"
          >
            <ShoppingBag className="h-4 w-4" />
            Queue: <span className="font-mono tabular-nums">{cart.items.length}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function scrollToId(e: MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const accentClasses: Record<string, string> = {
  atomic: "bg-atomic text-atomic-foreground",
  vault: "bg-vault text-vault-foreground",
  lithium: "bg-lithium text-lithium-foreground",
  aqua: "bg-aqua text-aqua-foreground",
  ink: "bg-ink text-ink-foreground",
};

function Home() {
  const { data = [], isLoading, isError } = useQuery<ClinicianView[]>({ queryKey: ["/api/clinicians"] });
  const [query, setQuery] = useState("");
  const [vibe, setVibe] = useState("All");
  const [selected, setSelected] = useState<ClinicianView | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((c) => {
      const matchesText = !q || [c.name, c.practice, c.region, c.tagline, c.era, ...c.vibes].join(" ").toLowerCase().includes(q);
      const matchesVibe = vibe === "All" || c.vibes.includes(vibe);
      return matchesText && matchesVibe;
    });
  }, [data, query, vibe]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="relative overflow-hidden border-b-2 border-ink bg-paper" data-testid="section-hero">
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(hsl(var(--ink))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--ink))_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:py-16">
            <div className="lg:col-span-7">
              <div className="eyebrow mb-5 text-atomic">Fictional concept marketplace, issue Nº 01</div>
              <h1 className="display-slab max-w-4xl text-[clamp(3.6rem,10vw,8.5rem)] uppercase tracking-[-0.07em]" data-testid="text-hero-title">
                Be well. Be tidy. Be terribly agreeable.
              </h1>
              <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed">
                A satirical AirBnB-style interface for imaginary mid-century composure specialists, wrapped in clinical mint, lipstick red, Swiss grids, and atomic-age cheer.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => document.getElementById("marketplace")?.scrollIntoView({ behavior: "smooth" })}
                  data-testid="button-browse-listings"
                  className="h-12 bg-atomic px-7 text-atomic-foreground hover:bg-atomic/90"
                >
                  Browse concept listings
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("moodboard")?.scrollIntoView({ behavior: "smooth" })}
                  data-testid="button-view-moodboard"
                  className="h-12 border-ink px-7"
                >
                  View design sources
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rotate-1 border-2 border-ink bg-card p-3 shadow-lg">
                <img
                  src={MOODBOARD["img-002"].src}
                  alt="Mid-century consumer collage with Kodak yellow, soda red, and commercial packaging"
                  className="aspect-[4/3] w-full object-cover"
                  data-testid="img-hero-collage"
                />
                <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[0.62rem] uppercase tracking-widest">
                  <span className="bg-vault px-2 py-1 text-vault-foreground">Atomic</span>
                  <span className="bg-aqua px-2 py-1 text-aqua-foreground">Clinical</span>
                  <span className="bg-lithium px-2 py-1 text-lithium-foreground">Aloof</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="marketplace" className="mx-auto max-w-7xl px-4 py-10 sm:px-6" data-testid="section-marketplace">
          <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div>
              <div className="eyebrow text-muted-foreground">Directory of imaginary composure specialists</div>
              <h2 className="mt-2 display-slab text-4xl uppercase tracking-[-0.04em]">Choose your preferred fiction</h2>
            </div>
            <div className="rounded-sm border-2 border-ink bg-card p-3 text-sm">
              <div className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-atomic" />
                <p>This is not a real health, wellness, or booking service. Every listing is invented for visual design critique.</p>
              </div>
            </div>
          </div>

          <div className="mb-6 grid gap-3 rounded-sm border-2 border-ink bg-card p-3 md:grid-cols-[1fr_auto]" data-testid="filters-marketplace">
            <label className="relative block">
              <span className="sr-only">Search fictional listings</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by vibe, region, or practice"
                className="h-11 border-ink pl-10"
                data-testid="input-search"
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              {vibeFilters.map((item) => (
                <Button
                  key={item}
                  variant={vibe === item ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVibe(item)}
                  data-testid={`button-filter-${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className={vibe === item ? "bg-ink text-ink-foreground hover:bg-ink/90" : "border-ink"}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          {isLoading && <ListingSkeleton />}
          {isError && <div className="border-2 border-atomic bg-lithium p-6" data-testid="status-error">The directory reel jammed. Please refresh the concept.</div>}
          {!isLoading && !isError && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" data-testid="grid-listings">
              {filtered.map((clinician) => (
                <ListingCard key={clinician.slug} clinician={clinician} onSelect={setSelected} />
              ))}
            </div>
          )}
        </section>

        <MoodboardSection />
        <ConceptSection />
      </main>
      <FooterDisclaimer />
      <CartDrawer />
      <DetailModal clinician={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function ListingSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" data-testid="status-loading">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-96 animate-pulse border-2 border-ink bg-muted" />
      ))}
    </div>
  );
}

function ListingCard({ clinician, onSelect }: { clinician: ClinicianView; onSelect: (c: ClinicianView) => void }) {
  const cart = useCart();
  const art = MOODBOARD[clinician.artworkRef] ?? MOODBOARD["img-002"];

  return (
    <Card className="group overflow-hidden border-2 border-ink bg-card shadow-md transition-transform hover:-translate-y-1" data-testid={`card-listing-${clinician.slug}`}>
      <div className="relative border-b-2 border-ink">
        <img src={art.src} alt={art.caption} className="aspect-[16/10] w-full object-cover saturate-[0.95]" data-testid={`img-listing-${clinician.slug}`} />
        <div className={`absolute left-3 top-3 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-widest ${accentClasses[clinician.accentHue] ?? accentClasses.atomic}`}>
          {clinician.era}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <div className="eyebrow text-muted-foreground">{clinician.practice}</div>
            <h3 className="mt-1 font-display text-2xl font-black leading-none" data-testid={`text-listing-name-${clinician.slug}`}>
              {clinician.honorific} {clinician.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-vault px-2 py-1 font-mono text-xs text-vault-foreground">
            <Star className="h-3 w-3 fill-current" /> {clinician.rating}
          </div>
        </div>
        <p className="min-h-[3.4rem] text-sm leading-relaxed text-muted-foreground">{clinician.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {clinician.vibes.slice(0, 3).map((v) => (
            <Badge key={v} variant="outline" className="border-ink text-[0.65rem]" data-testid={`badge-vibe-${clinician.slug}-${v}`}>
              {v}
            </Badge>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-ink/20 pt-4">
          <div>
            <div className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">Concept fee</div>
            <div className="text-sm font-semibold">{clinician.priceLabel}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-ink" onClick={() => onSelect(clinician)} data-testid={`button-details-${clinician.slug}`}>
              Details
            </Button>
            <Button
              size="sm"
              disabled={!clinician.available}
              onClick={() => {
                cart.add(makeSelection(clinician));
                cart.setOpen(true);
              }}
              data-testid={`button-add-${clinician.slug}`}
              className="bg-atomic text-atomic-foreground hover:bg-atomic/90"
            >
              {cart.has(clinician.slug) ? "Queued" : clinician.available ? "Queue" : "Unavailable"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailModal({ clinician, onClose }: { clinician: ClinicianView | null; onClose: () => void }) {
  const cart = useCart();
  if (!clinician) return null;
  const art = MOODBOARD[clinician.artworkRef] ?? MOODBOARD["img-002"];

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-ink/55 p-3 md:items-center md:justify-center" role="dialog" aria-modal="true" data-testid="dialog-detail">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-auto border-2 border-ink bg-paper shadow-lg">
        <div className="flex items-center justify-between border-b-2 border-ink bg-card px-4 py-3">
          <div className="eyebrow">Fictional listing dossier</div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close detail" data-testid="button-close-detail">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid gap-0 md:grid-cols-2">
          <img src={art.src} alt={art.caption} className="h-full min-h-80 w-full object-cover" data-testid="img-detail-art" />
          <div className="p-6">
            <div className="eyebrow text-atomic">{clinician.region}</div>
            <h3 className="mt-2 display-slab text-4xl uppercase tracking-[-0.04em]">
              {clinician.honorific} {clinician.name}
            </h3>
            <p className="mt-4 font-serif text-lg italic">{clinician.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{clinician.blurb}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Stat label="Serenity index" value={`${clinician.serenityIndex}/100`} />
              <Stat label="Reviews" value={`${clinician.reviews}`} />
            </div>
            <div className="mt-5">
              <div className="eyebrow mb-2">Available concept rituals</div>
              <div className="grid gap-2">
                {clinician.modalities.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      cart.add(makeSelection(clinician, m));
                      cart.setOpen(true);
                    }}
                    className="flex items-center justify-between border border-ink/30 bg-card px-3 py-2 text-left text-sm hover:bg-aqua/30"
                    data-testid={`button-ritual-${m.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    {m}
                    <BadgeCheck className="h-4 w-4 text-atomic" />
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-5 border-t border-ink/20 pt-4 font-mono text-[0.68rem] uppercase leading-relaxed tracking-widest text-muted-foreground">
              Parody dossier only. No procedures, no real clinicians, no real booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-ink bg-card p-3" data-testid={`stat-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
      <div className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl font-black">{value}</div>
    </div>
  );
}

function CartDrawer() {
  const cart = useCart();
  if (!cart.open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-ink/45" data-testid="drawer-cart">
      <aside className="flex h-full w-full max-w-md flex-col border-l-2 border-ink bg-paper">
        <div className="flex items-center justify-between border-b-2 border-ink bg-card px-4 py-3">
          <div>
            <div className="eyebrow">Concept queue</div>
            <h3 className="font-display text-2xl font-black">Not a checkout</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => cart.setOpen(false)} aria-label="Close queue" data-testid="button-close-cart">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {cart.items.length === 0 ? (
            <div className="border-2 border-dashed border-ink p-6 text-center" data-testid="empty-cart">
              <p className="font-serif italic">Your imaginary appointment card is blank.</p>
              <p className="mt-2 text-sm text-muted-foreground">Queue a listing to compose a fictional checkout flow.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.slug} className="border-2 border-ink bg-card p-3" data-testid={`cart-item-${item.slug}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.practice}</div>
                    </div>
                    <button onClick={() => cart.remove(item.slug)} aria-label={`Remove ${item.name}`} data-testid={`button-remove-${item.slug}`}>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 bg-aqua/35 px-2 py-1 font-mono text-[0.68rem] uppercase tracking-widest">{item.ritual}</div>
                  <div className="mt-2 text-sm">{item.priceLabel}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t-2 border-ink p-4">
          <Button
            className="w-full bg-vault text-vault-foreground hover:bg-vault/90"
            onClick={cart.clear}
            disabled={cart.items.length === 0}
            data-testid="button-clear-cart"
          >
            Reset concept queue
          </Button>
          <p className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            No payment. No booking. No healthcare action.
          </p>
        </div>
      </aside>
    </div>
  );
}

function MoodboardSection() {
  return (
    <section id="moodboard" className="border-y-2 border-ink bg-ink text-ink-foreground" data-testid="section-moodboard">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="eyebrow text-vault">Source board</div>
            <h2 className="display-slab text-4xl uppercase tracking-[-0.04em]">Imported visual language</h2>
          </div>
          <p className="max-w-xl text-sm text-ink-foreground/75">
            PDF-derived plates become the app’s UI grammar: product collage, editorial poise, Swiss grid control, and atomic yellow warning cheer.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {MOODBOARD_KEYS.map((key) => {
            const item = MOODBOARD[key];
            return (
              <figure key={key} className="border-2 border-paper bg-paper text-foreground" data-testid={`figure-moodboard-${key}`}>
                <img src={item.src} alt={item.caption} className="aspect-[4/3] w-full object-cover" />
                <figcaption className="p-3">
                  <div className="text-sm font-semibold">{item.caption}</div>
                  <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-widest text-muted-foreground">{item.credit}</div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ConceptSection() {
  return (
    <section id="concept" className="mx-auto max-w-7xl px-4 py-12 sm:px-6" data-testid="section-concept">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="eyebrow text-atomic">Design logic</div>
          <h2 className="mt-2 display-slab text-4xl uppercase tracking-[-0.04em]">Clinical order meets domestic unreality</h2>
        </div>
        <div className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
          {[
            ["Sterile", "Porcelain cards, crisp borders, chart-like labels, and measured spacing keep the interface hospital-clean."],
            ["Cheery", "Atomic yellow and lipstick red pull from packaging, optimism reels, and the sunny housewife archetype."],
            ["Aloof", "Copy is polite but emotionally flattened, like a concierge reading from a training film."],
            ["Pre-war", "Fallout-adjacent color, vault language, and consumer futurism add retro-dystopian tension."],
          ].map(([title, body]) => (
            <div key={title} className="border-2 border-ink bg-card p-5" data-testid={`card-concept-${title.toLowerCase()}`}>
              <h3 className="font-display text-2xl font-black">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={Home} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <CartProvider>
            <Toaster />
            <Router hook={useHashLocation}>
              <AppRouter />
            </Router>
          </CartProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
