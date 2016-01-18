var path = require('path');
var webpack = require('webpack');
 
module.exports = {
        entry: './browserjs/home.app.es6',
        output: { path: __dirname+'/public/', filename: 'bundle.js' },
	devtool: 'inline-source-map',
        module: {
                loaders: [
                        {
                                test: /.(jsx|es6)?$/,
                                loader: 'babel-loader',
                                exclude: /node_modules/,
                                query: {
                                        presets: ['es2015', 'react']
                                }
                        },
			{ test: /\.scss$/, loaders: ["style", "css", "sass", "autoprefixer-loader?browsers=last 3 versions"] },
                        { test: /\.css$/, loader: "style!css" },
                        { test: /\.png$/, loader: "file-loader" },
                        { test: /\.gif$/, loader: "file-loader" },
                        { test: /\.(jpg|ttf|woff2|eot|woff|svg)$/, loader: "file-loader" }
                ]
        },
};

