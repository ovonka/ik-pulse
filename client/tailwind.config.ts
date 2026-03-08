import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        "surface-soft": "var(--surface-soft)",

        text: "var(--text)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-inverse": "var(--text-inverse)",

        border: "var(--border)",
        "border-strong": "var(--border-strong)",

        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-soft": "var(--primary-soft)",

        success: "var(--success)",
        "success-soft": "var(--success-soft)",

        danger: "var(--danger)",
        "danger-soft": "var(--danger-soft)",

        warning: "var(--warning)",
        "warning-soft": "var(--warning-soft)",

        info: "var(--info)",
        "info-soft": "var(--info-soft)",

        sidebar: "var(--sidebar-bg)",
        "sidebar-hover": "var(--sidebar-hover)",
        "sidebar-active": "var(--sidebar-active)",
        "sidebar-text": "var(--sidebar-text)",
        "sidebar-text-muted": "var(--sidebar-text-muted)",
      },
      boxShadow: {
        soft: "var(--shadow-sm)",
        card: "var(--shadow-md)",
        elevated: "var(--shadow-lg)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
  plugins: [],
};

export default config;