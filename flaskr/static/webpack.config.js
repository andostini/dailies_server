const webpack = require('webpack');
const config = {
    entry: {
        viewer: __dirname + '/scripts/viewer.js',
        settings: __dirname + '/scripts/settings.js',
        login: __dirname + '/scripts/login.js',
    }, 
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },

    module: {
        rules: [
            {
            test: /\.(js|jsx)?/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    }
};
module.exports = config;
