/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#011526', // Deepest Navy
                secondary: '#ffffff', // White
                accent: '#0583F2', // Bright Blue
                palette: {
                    main: '#011526',    // Deepest Navy/Black
                    card: '#0C2059',    // Deep Blue
                    primary: '#2142A6', // Royal Blue
                    accent: '#0583F2',  // Bright Blue
                    dark: '#0D0D0D',    // Titanium Black
                },
                navy: {
                    900: '#011526',
                    800: '#0C2059',
                }
            },
            fontFamily: {
                hebrew: ['Rubik', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
