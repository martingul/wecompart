const path = require('path');

const config = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'build')
    },
    stats: {
        colors: true
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/i,
                exclude: /\/node_modules\//,
                use: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ['postcss-preset-env', { /* options */}],
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: './assets'
                    }
                }
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
    if (argv.mode == 'development') {
        config.output.filename = 'app.js';
        config.optimization = {minimize: false};
    } else if (argv.mode == 'production') {
        config.output.filename = 'app.min.js';
        config.optimization = {minimize: true};
    }

    return config;
}