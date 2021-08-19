const path = require('path');

const config = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    stats: {
        colors: true
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /\/node_modules\//,
                use: 'babel-loader',
            },
            {
                test: /\.svg$/i,
                use: {
                    loader: 'svg-url-loader',
                    options: {
                        iesafe: true,
                    }
                }
            }
        ]
    },
}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.output.filename = 'app.js';
        config.optimization = {minimize: false};
    } else if (argv.mode === 'production') {
        config.output.filename = 'app.min.js';
        config.optimization = {minimize: true};
    }

    return config;
}