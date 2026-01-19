/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0a192f', // Navy Blue
                secondary: '#ffffff', // White
                accent: '#64ffda', // Optional accent to pop if needed, or stick to white/navy
                navy: {
                    900: '#0a192f',
                    800: '#112240',
                }
            },
            fontFamily: {
                hebrew: ['Rubik', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
