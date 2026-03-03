import type { Experiment } from "./types";

export const experiments: Record<string, Experiment> = {
  hero_redesign: {
    id: "hero_redesign",
    name: "Hero Section Redesign",
    description: "Test new hero layout with prominent CTA versus classic academic style",
    enabled: true,
    startDate: "2024-01-01",
    endDate: null,
    variants: [
      {
        id: "control",
        name: "Control",
        weight: 50,
        description: "Original hero with text-focused layout",
      },
      {
        id: "variant_a",
        name: "Bold CTA",
        weight: 50,
        description: "Redesigned hero with prominent call-to-action buttons",
      },
    ],
  },
  nav_style: {
    id: "nav_style",
    name: "Navigation Style",
    description: "Compact navigation versus expanded navigation with descriptions",
    enabled: true,
    startDate: "2024-02-01",
    endDate: null,
    variants: [
      {
        id: "compact",
        name: "Compact Nav",
        weight: 34,
        description: "Minimal navigation with icon-only mobile view",
      },
      {
        id: "expanded",
        name: "Expanded Nav",
        weight: 33,
        description: "Full navigation with descriptive subtitles",
      },
      {
        id: "mega_menu",
        name: "Mega Menu",
        weight: 33,
        description: "Dropdown mega menu with grouped links",
      },
    ],
  },
  cta_color: {
    id: "cta_color",
    name: "CTA Button Color",
    description: "Test brand primary versus a contrasting green CTA",
    enabled: false,
    startDate: "2024-03-01",
    endDate: "2024-04-01",
    variants: [
      {
        id: "red",
        name: "Brand Blue",
        weight: 50,
        description: "Default brand blue CTA",
      },
      {
        id: "green",
        name: "Green Accent",
        weight: 50,
        description: "High-contrast green CTA",
      },
    ],
  },
};

export function getActiveExperiments(): Experiment[] {
  const now = new Date().toISOString().split("T")[0];
  return Object.values(experiments).filter(
    (exp) =>
      exp.enabled &&
      exp.startDate <= now &&
      (exp.endDate === null || exp.endDate >= now)
  );
}

export function getExperiment(id: string): Experiment | undefined {
  return experiments[id];
}
