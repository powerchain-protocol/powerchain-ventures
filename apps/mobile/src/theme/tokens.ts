export const colors = {
  light: {
    background: "#F7F9F7",
    surface: "#FFFFFF",
    surfaceMuted: "#EFF3F0",
    text: "#0D1E18",
    textMuted: "#68766F",
    border: "#DFE6E1",
    green: "#075F3B",
    greenPressed: "#064C31",
    greenSoft: "#EAF5EF",
    success: "#0A7A4C",
    warning: "#946200",
    warningSoft: "#FFF5D9",
    danger: "#B42318",
    dangerSoft: "#FDEDEC",
  },
  dark: {
    background: "#0B1210",
    surface: "#111B17",
    surfaceMuted: "#17231E",
    text: "#F5F8F6",
    textMuted: "#9AA9A1",
    border: "#26362E",
    green: "#38A675",
    greenPressed: "#2E8E64",
    greenSoft: "#153127",
    success: "#4AC38A",
    warning: "#E0B45D",
    warningSoft: "#302916",
    danger: "#FF8178",
    dangerSoft: "#321B1A",
  },
} as const;

export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const type = { hero: 36, title: 32, h1: 28, h2: 20, body: 15, label: 12, caption: 11 } as const;
export const touch = { minimum: 44, primary: 52 } as const;
