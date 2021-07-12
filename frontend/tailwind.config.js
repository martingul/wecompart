module.exports = {
    important: true,
    purge: ['./src/**/*.{html,vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            'display': [
                'Ubuntu',
                'system-ui',
                '-apple-system',
                'BlinkMacSystemFont',
                'segoe ui', 'Roboto',
                'helvetica neue',
                'Arial',
                'noto sans',
                'sans-serif'
            ],
            'body': [
                'Ubuntu',
                'system-ui',
                '-apple-system',
                'BlinkMacSystemFont',
                'segoe ui', 'Roboto',
                'helvetica neue',
                'Arial',
                'noto sans',
                'sans-serif'
            ]
        },
        extend: {},
    },
    variants: {},
    plugins: [],
}