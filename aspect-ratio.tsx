import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ClinicianView } from "@shared/schema";

// "Cart" is a satirical concept-booking selection — NOT a real cart.
// All entries are imaginary appointments with imaginary practitioners.
// State is held in memory only (no storage permitted in sandbox).
export type Selection = {
  slug: string;
  name: string;
  practice: string;
  priceLabel: string;
  ritual: string; // e.g. "Linen-Folding Meditation"
};

type CartCtx = {
  items: Selection[];
  add: (sel: Selection) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Selection[]>([]);
  const [open, setOpen] = useState(false);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      open,
      setOpen,
      add: (sel) =>
        setItems((cur) => (cur.find((c) => c.slug === sel.slug) ? cur : [...cur, sel])),
      remove: (slug) => setItems((cur) => cur.filter((c) => c.slug !== slug)),
      has: (slug) => items.some((c) => c.slug === slug),
      clear: () => setItems([]),
    }),
    [items, open],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart inside CartProvider");
  return v;
}

export function makeSelection(c: ClinicianView, ritual?: string): Selection {
  return {
    slug: c.slug,
    name: `${c.honorific} ${c.name}`,
    practice: c.practice,
    priceLabel: c.priceLabel,
    ritual: ritual ?? c.modalities[0] ?? "Concept Session",
  };
}
