export const themeConfig_v2414 = {
  light: {
    primary: {
      DEFAULT: "hsl(222.2 47.4% 11.2%)",
      foreground: "hsl(210 40% 98%)",
    },
    secondary: {
      DEFAULT: "hsl(210 40% 96.1%)",
      foreground: "hsl(222.2 47.4% 11.2%)",
    },
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 84% 4.9%)",
    card: {
      DEFAULT: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)",
    },
    popover: {
      DEFAULT: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)",
    },
    muted: {
      DEFAULT: "hsl(210 40% 96.1%)",
      foreground: "hsl(215.4 16.3% 46.9%)",
    },
    accent: {
      DEFAULT: "hsl(210 40% 96.1%)",
      foreground: "hsl(222.2 47.4% 11.2%)",
    },
    destructive: {
      DEFAULT: "hsl(0 84.2% 60.2%)",
      foreground: "hsl(210 40% 98%)",
    },
    border: "hsl(214.3 31.8% 91.4%)",
    input: "hsl(214.3 31.8% 91.4%)",
    ring: "hsl(215 20.2% 65.1%)",
  },
  dark: {
    primary: {
      DEFAULT: "hsl(210 40% 98%)",
      foreground: "hsl(222.2 47.4% 11.2%)",
    },
    secondary: {
      DEFAULT: "hsl(217.2 32.6% 17.5%)",
      foreground: "hsl(210 40% 98%)",
    },
    background: "hsl(222.2 84% 4.9%)",
    foreground: "hsl(210 40% 98%)",
    card: {
      DEFAULT: "hsl(222.2 84% 4.9%)",
      foreground: "hsl(210 40% 98%)",
    },
    popover: {
      DEFAULT: "hsl(222.2 84% 4.9%)",
      foreground: "hsl(210 40% 98%)",
    },
    muted: {
      DEFAULT: "hsl(217.2 32.6% 17.5%)",
      foreground: "hsl(215 20.2% 65.1%)",
    },
    accent: {
      DEFAULT: "hsl(217.2 32.6% 17.5%)",
      foreground: "hsl(210 40% 98%)",
    },
    destructive: {
      DEFAULT: "hsl(0 62.8% 30.6%)",
      foreground: "hsl(0 85.7% 97.3%)",
    },
    border: "hsl(217.2 32.6% 17.5%)",
    input: "hsl(217.2 32.6% 17.5%)",
    ring: "hsl(217.2 32.6% 17.5%)",
  },
  // Add custom brand colors here
  brand: {
    primary: "#0066FF",
    secondary: "#00CC99",
    accent: "#FF3366",
  },
} as const

export type ThemeConfig = typeof themeConfig_v2414
