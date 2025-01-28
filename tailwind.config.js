module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    theme: {
        extend: {
            colors: {
                primary: {
                    '50': '#fff7e3',
                    '100': '#ffedcc',
                    '200': '#ffdb99',
                    '300': '#ffc966',
                    '400': '#feb833',
                    '500': '#fecc32',
                    '600': '#e3b02e',
                    '700': '#b58a25',
                    '800': '#8a691d',
                    '900': '#6c5317',
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    '50': '#e3e3ff',
                    '100': '#c7c7ff',
                    '200': '#8f8fff',
                    '300': '#5656ff',
                    '400': '#1d1dff',
                    '500': '#060675',
                    '600': '#060660',
                    '700': '#050550',
                    '800': '#040440',
                    '900': '#030330',
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                text: {
                    '50': '#f0f0f0',
                    '100': '#e1e1e1',
                    '200': '#c4c4c4',
                    '300': '#a7a7a7',
                    '400': '#8a8a8a',
                    '500': '#333333',
                    '600': '#505050',
                    '700': '#333333',
                    '800': '#262626',
                    '900': '#1a1a1a',
                    DEFAULT: '#333333'
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                "caret-blink": {
                    "0%,70%,100%": { opacity: "1" },
                    "20%,50%": { opacity: "0" },
                },
            },
            animation: {
                "caret-blink": "caret-blink 1.25s ease-out infinite",
            },
        }
    },
    plugins: [require("tailwindcss-animate")],
};
