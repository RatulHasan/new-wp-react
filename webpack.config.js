const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const isProduction = process.env.NODE_ENV === 'production';

const updatedConfig = {
    ...defaultConfig,
    entry: {
        ...defaultConfig.entry,
        index: './src/index',
    },
    // Change the output path to `dist` in development or `build` in production
    output: {
        ...defaultConfig.output,
        path: __dirname + (isProduction ? '/build/assets' : '/assets'),
    },
};

// For development, add the devServer configuration
if (!isProduction) {
    updatedConfig.devServer = {
        devMiddleware: {
            writeToDisk: true,
        },
        allowedHosts: 'all',
        host: 'pay-check-mate.test',
        port: 8887,
        proxy: {
            '/build': {
                pathRewrite: {
                    '^/build': '',
                },
            },
        },
    };
}

module.exports = updatedConfig;
