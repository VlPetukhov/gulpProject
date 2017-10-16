const webpack = require('webpack');
const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin('css/[name].css');

module.exports = {
    entry:{
        app: [
            './src/app/index.js',
            './src/index.html',
            './src/assets/favicon.ico'
        ],
        preload: [
            './node_modules/purecss/build/grids-responsive-min.css',
        ],
        oldIE: [
            './node_modules/purecss/build/grids-responsive-old-ie-min.css',
        ],
        vendor: [
            'mithril',
            'store',
            'translate.js',
            './node_modules/purecss/build/pure-min.css',
        ],
    },
    output: {
        path: path.resolve(__dirname, 'build/'),
        filename: 'js/[name].js',
        publicPath: '/',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /(node_modules)|(bower_components)/,
                options: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.less$/i,
                use: extractCSS.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        "less-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: function () {
                                    return [
                                        require('precss'),
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        }
                    ]
                })
            },
            {
                test: /\.css$/i,
                use: extractCSS.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: function () {
                                    return [
                                        require('precss'),
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'url-loader?limit=10000&name=fonts/[name].[ext]'
            },
            {
                test: /\.ttf$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.eot$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.svg$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.html?$/,
                use: [
                    'file-loader?name=[name].[ext]',
                    'extract-loader',
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true
                        }
                    }]
            },
            {
                test: /\.(ico)$/i,
                exclude: /images(\\|\/)([^\/\s]+)\.(jpe?g|png|gif)$/i,
                use: [
                    'file-loader?name=[name].[ext]',
                    // 'url-loader?name=images/[name].[ext]',
                    'image-webpack-loader?bypassOnDebug&optimizationLevel=7'
                ]
            },
            {
                test: /images(\\|\/)[^\/\s]+\.(jpe?g|png|gif)$/i,
                exclude: /backgrounds(\\|\/)([^\/\s]+)\.(jpe?g|png|gif)$/i,
                use: [
                    'file-loader?name=images/[name].[ext]',
                    // 'url-loader?name=images/[name].[ext]',
                    'image-webpack-loader?bypassOnDebug&optimizationLevel=7'
                ]
            },
            {
                test: /backgrounds(\\|\/)[^\/\s]+\.(jpe?g|png|gif)$/i,
                use: [
                    'file-loader?name=images/backgrounds/[name].[ext]',
                    // 'url-loader?name=images/backgrounds/[name].[ext]'
                ]
            },
        ],
    },
    plugins: [
        extractCSS,
        new OptimizeCssAssetsPlugin({
            // assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                }
            },
            canPrint: true
        }),
    ]
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    );
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            sourcemap: true,
            compress: {
                warnings:false
            }
        })
    );
}