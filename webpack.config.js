var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        home: './browserjs/home.app.es6',
        collectionItem: './browserjs/collectionItem.app.jsx',
        collection: './browserjs/collection.app.js',
        crawler: './browserjs/crawler.app.jsx',
        file: './browserjs/file.app.jsx',
        name: './browserjs/name.app.js',
        tubes: './browserjs/tubes.app.jsx',
    },
    output: {
        path: __dirname + '/public/js/',
        filename: '[name].bundle.js'
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [
	{
            test: /.(jsx?|es6)?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }
        }, 
	{ test: /\.scss$/, loaders: ["style", "css", "sass", "postcss-loader?browsers=last 3 versions"] }, 
	{ test: /\.css$/, loader: "style!css" },
	{ test: /\.json$/, loader: "json-loader" },
	{ test: /\.handlebars$/, loader: "handlebars-loader" },
	{ test: /\.(png|jpg|ttf|woff2|eot|woff|svg|gif)$/, loader: "file-loader" }
]
    },
};
