import type { Config } from "tailwindcss"

const config: Config = {
    // Use class-based dark mode
    darkMode: "class",

    // Content paths for Tailwind to scan
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],

    // Prefix for Tailwind utilities (optional)
    prefix: "",

    theme: {
        // Container configuration
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },

        extend: {
            // Custom colors
            colors: {
                // Shadcn UI color system
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },

            // Custom border radius
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },

            // Custom keyframes for animations
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "fade-out": {
                    from: { opacity: "1" },
                    to: { opacity: "0" },
                },
                "slide-in-from-top": {
                    from: { transform: "translateY(-100%)" },
                    to: { transform: "translateY(0)" },
                },
                "slide-in-from-bottom": {
                    from: { transform: "translateY(100%)" },
                    to: { transform: "translateY(0)" },
                },
                "slide-in-from-left": {
                    from: { transform: "translateX(-100%)" },
                    to: { transform: "translateX(0)" },
                },
                "slide-in-from-right": {
                    from: { transform: "translateX(100%)" },
                    to: { transform: "translateX(0)" },
                },
                "zoom-in": {
                    from: { transform: "scale(0.95)", opacity: "0" },
                    to: { transform: "scale(1)", opacity: "1" },
                },
                "zoom-out": {
                    from: { transform: "scale(1)", opacity: "1" },
                    to: { transform: "scale(0.95)", opacity: "0" },
                },
            },

            // Custom animations
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.2s ease-out",
                "fade-out": "fade-out 0.2s ease-out",
                "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
                "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
                "slide-in-from-left": "slide-in-from-left 0.3s ease-out",
                "slide-in-from-right": "slide-in-from-right 0.3s ease-out",
                "zoom-in": "zoom-in 0.2s ease-out",
                "zoom-out": "zoom-out 0.2s ease-out",
            },

            // Custom font families
            fontFamily: {
                sans: ["var(--font-sans)", "system-ui", "sans-serif"],
                mono: ["var(--font-mono)", "monospace"],
            },

            // Custom spacing
            spacing: {
                "18": "4.5rem",
                "88": "22rem",
                "128": "32rem",
            },

            // Custom z-index values
            zIndex: {
                "60": "60",
                "70": "70",
                "80": "80",
                "90": "90",
                "100": "100",
            },

            // Custom typography
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: "65ch",
                        color: "hsl(var(--foreground))",
                        a: {
                            color: "hsl(var(--primary))",
                            "&:hover": {
                                color: "hsl(var(--primary) / 0.8)",
                            },
                        },
                        h1: {
                            color: "hsl(var(--foreground))",
                        },
                        h2: {
                            color: "hsl(var(--foreground))",
                        },
                        h3: {
                            color: "hsl(var(--foreground))",
                        },
                        h4: {
                            color: "hsl(var(--foreground))",
                        },
                        code: {
                            color: "hsl(var(--primary))",
                        },
                        strong: {
                            color: "hsl(var(--foreground))",
                        },
                        blockquote: {
                            color: "hsl(var(--muted-foreground))",
                            borderLeftColor: "hsl(var(--border))",
                        },
                    },
                },
            },
        },
    },

    // Plugins
    plugins: [
        require("tailwindcss-animate"),
        // Uncomment if you need @tailwindcss/typography
        // require("@tailwindcss/typography"),
    ],
}

export default config
