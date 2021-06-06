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
        extend: {
            screens: {
                'xs': '320px',
            },
            margin: {
                '72': '18rem',
                '80': '20rem',
                '88': '22rem',
                '96': '24rem',
                '104': '26rem',
            },
            colors: {
                'accent': {
                    '100': '#b3a4d7',
                    '200': '#a390ce',
                    '300': '#9a86ca',
                    '400': '#8f78c4',
                    '500': '#846bbe',
                    '600': '#8167bd',
                    '700': '#6d50b2',
                    '800': '#61469f',
                    '900': '#5b4398'
                },
            },
        },
    },
    variants: {
        backgroundColor: ['responsive', 'hover', 'focus', 'checked', 'disabled'],
        opacity: ['disabled']
    },
    plugins: [],
}