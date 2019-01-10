const path = require('path');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: { 'vue-inversify': './src/index.ts' },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: [ '.js', '.ts' ],
        modules: [ path.resolve('./src'), 'node_modules' ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'bin'),
        library: 'vue-inversify',
        libraryTarget: 'umd'
    },
    plugins: [ ]
}