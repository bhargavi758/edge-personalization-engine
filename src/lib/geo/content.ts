export interface RegionalHero {
  headline: string;
  subheadline: string;
  ctaText: string;
  imageAlt: string;
  greeting: string;
}

export interface RegionalEvent {
  title: string;
  date: string;
  location: string;
  description: string;
  type: "lecture" | "workshop" | "seminar" | "conference";
}

const regionalHeroes: Record<string, RegionalHero> = {
  "North America": {
    headline: "Shaping the Future of Technology",
    subheadline:
      "Discover how Stanford's research is driving innovation across the Bay Area and beyond.",
    ctaText: "Explore Programs",
    imageAlt: "Stanford campus aerial view",
    greeting: "Welcome",
  },
  Europe: {
    headline: "Bridging Continents Through Research",
    subheadline:
      "Stanford's European partnerships are advancing interdisciplinary breakthroughs in AI, climate, and health.",
    ctaText: "View Collaborations",
    imageAlt: "Stanford international research lab",
    greeting: "Welcome",
  },
  Asia: {
    headline: "Innovation Without Borders",
    subheadline:
      "From Stanford to Asia-Pacific — joint research programs tackling the world's hardest problems.",
    ctaText: "Discover Partnerships",
    imageAlt: "Stanford Asia research exchange",
    greeting: "Welcome",
  },
  "South America": {
    headline: "Empowering Global Change Makers",
    subheadline:
      "Stanford Knight-Hennessy Scholars from Latin America are leading transformative change worldwide.",
    ctaText: "Meet the Scholars",
    imageAlt: "Stanford Knight-Hennessy scholars gathering",
    greeting: "Bienvenidos",
  },
  Oceania: {
    headline: "Research Across the Pacific",
    subheadline:
      "Collaborative initiatives with leading Australian and New Zealand universities.",
    ctaText: "Learn More",
    imageAlt: "Stanford Pacific research partnership",
    greeting: "G'day",
  },
  Africa: {
    headline: "Building the Next Generation",
    subheadline:
      "Stanford's Africa-focused programs nurturing the continent's brightest minds in technology and entrepreneurship.",
    ctaText: "See Opportunities",
    imageAlt: "Stanford Africa innovation program",
    greeting: "Welcome",
  },
};

const regionalEvents: Record<string, RegionalEvent[]> = {
  "North America": [
    {
      title: "AI in Higher Education Summit",
      date: "2024-04-15",
      location: "Stanford Campus, Palo Alto",
      description:
        "Exploring responsible AI adoption in university teaching and research.",
      type: "conference",
    },
    {
      title: "Web Technologies Workshop",
      date: "2024-04-22",
      location: "Gates Computer Science Building",
      description: "Hands-on workshop covering Edge Computing and serverless architectures.",
      type: "workshop",
    },
    {
      title: "Faculty Lecture: The Future of the Web Platform",
      date: "2024-05-01",
      location: "Hewlett Teaching Center",
      description: "A deep dive into WebAssembly, Edge Functions, and the next decade of web standards.",
      type: "lecture",
    },
  ],
  Europe: [
    {
      title: "Stanford-Oxford Digital Humanities Seminar",
      date: "2024-05-10",
      location: "Virtual — Oxford / Stanford",
      description:
        "Cross-continental seminar on computational approaches to cultural heritage.",
      type: "seminar",
    },
    {
      title: "European Research Partners Symposium",
      date: "2024-06-01",
      location: "ETH Zurich",
      description: "Annual gathering of Stanford's European research collaborators.",
      type: "conference",
    },
  ],
  Asia: [
    {
      title: "Stanford-Tsinghua AI Ethics Forum",
      date: "2024-05-20",
      location: "Virtual — Beijing / Stanford",
      description:
        "Discussing ethical frameworks for AI governance across different regulatory environments.",
      type: "seminar",
    },
    {
      title: "Robotics in Healthcare Workshop",
      date: "2024-06-15",
      location: "Stanford Center at Peking University",
      description: "Exploring robotic surgery and AI-assisted diagnostics.",
      type: "workshop",
    },
  ],
  default: [
    {
      title: "Stanford Global Innovation Conference",
      date: "2024-07-01",
      location: "Virtual",
      description:
        "A worldwide virtual conference on emerging technologies and their societal impact.",
      type: "conference",
    },
  ],
};

export function getRegionalHero(continent: string): RegionalHero {
  return (
    regionalHeroes[continent] ?? regionalHeroes["North America"]
  );
}

export function getRegionalEvents(continent: string): RegionalEvent[] {
  return regionalEvents[continent] ?? regionalEvents["default"];
}
