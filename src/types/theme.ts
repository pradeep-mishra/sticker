export type ThemeId =
  | "yellow"
  | "blue"
  | "green"
  | "pink"
  | "purple"
  | "orange";

export interface NoteTheme {
  id: ThemeId;
  name: string;
  primaryColor: string;
  noteBackground: string;
  borderColor: string;
  anchorHighlight: string;
}

export const THEMES: Record<ThemeId, NoteTheme> = {
  yellow: {
    id: "yellow",
    name: "Classic",
    primaryColor: "#EAB308",
    noteBackground: "rgba(254, 249, 195, 0.95)",
    borderColor: "rgba(234, 179, 8, 0.3)",
    anchorHighlight: "#EAB308"
  },
  blue: {
    id: "blue",
    name: "Ocean",
    primaryColor: "#3B82F6",
    noteBackground: "rgba(219, 234, 254, 0.95)",
    borderColor: "rgba(59, 130, 246, 0.3)",
    anchorHighlight: "#3B82F6"
  },
  green: {
    id: "green",
    name: "Forest",
    primaryColor: "#22C55E",
    noteBackground: "rgba(220, 252, 231, 0.95)",
    borderColor: "rgba(34, 197, 94, 0.3)",
    anchorHighlight: "#22C55E"
  },
  pink: {
    id: "pink",
    name: "Rose",
    primaryColor: "#EC4899",
    noteBackground: "rgba(252, 231, 243, 0.95)",
    borderColor: "rgba(236, 72, 153, 0.3)",
    anchorHighlight: "#EC4899"
  },
  purple: {
    id: "purple",
    name: "Lavender",
    primaryColor: "#8B5CF6",
    noteBackground: "rgba(237, 233, 254, 0.95)",
    borderColor: "rgba(139, 92, 246, 0.3)",
    anchorHighlight: "#8B5CF6"
  },
  orange: {
    id: "orange",
    name: "Sunset",
    primaryColor: "#F97316",
    noteBackground: "rgba(255, 237, 213, 0.95)",
    borderColor: "rgba(249, 115, 22, 0.3)",
    anchorHighlight: "#F97316"
  }
};

export const DEFAULT_THEME_ID: ThemeId = "yellow";

export const getTheme = (id: ThemeId): NoteTheme => THEMES[id];
