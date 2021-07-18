module.exports = {
    important: true,
    purge: [
        './src/components/*.{html,js,ts,jsx,tsx}',
        './src/views/*.{html,js,ts,jsx,tsx}',
        './src/*.{html,js,ts,jsx,tsx}'
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            'display': [
                'Inter',
                'system-ui',
                '-apple-system',
                'BlinkMacSystemFont',
                'segoe ui', 'Roboto',
                'helvetica neue',
                'Arial',
                'sans-serif',
            ],
            'body': [
                'Inter',
                'system-ui',
                '-apple-system',
                'BlinkMacSystemFont',
                'segoe ui', 'Roboto',
                'helvetica neue',
                'Arial',
                'sans-serif',
            ],
            'serif': ['ui-serif'],
            'mono': [
                'monospace',
                'ui-monospace',
            ],
        },
        extend: {},
    },
    variants: {},
    plugins: [],
}