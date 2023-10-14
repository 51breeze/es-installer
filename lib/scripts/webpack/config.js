const path = require("path");
const fs = require("fs");
const {DefinePlugin} = require("webpack");
const webpackbar = require("webpackbar");
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin')
const cwd = path.join(__dirname, '../../');

const config_path = path.join( cwd ,'es.config.js')
const publicPath = config_path.publicPath;

const bootstrap = path.join( cwd, 'src', 'App.es' );
const project_config = config_path && fs.existsSync(config_path) ? require( config_path ) : {
    chunk:true,
    bootstrap,
    workspace:path.join( cwd, 'src'),
    output:path.join( cwd, 'build')
};

const entryMap = typeof project_config.bootstrap ==="object" ? project_config.bootstrap : {
    "main":project_config.bootstrap || bootstrap
};

if( entryMap.main && typeof entryMap.main ==="string" && !path.isAbsolute( entryMap.main ) ){
    entryMap.main = path.resolve(project_config.workspace, entryMap.main);
}

const project_config_plugins = project_config.plugins || [];
const esPlugins = project_config_plugins.map( plugin=>{
    const pluginName = typeof plugin.plugin === 'function' && plugin.plugin.name ? plugin.plugin.name : plugin.name;
    return {
        name:pluginName,
        plugin:typeof plugin.name === 'function' ? plugin.name : require( plugin.name ),
        options:Object.assign({ 
            env:process.env,
            webpack:true,
            styleLoader: ['style-loader','css-loader'],
            useAbsolutePathImport:true,
            output:project_config.output,
            sourceMaps:false,
            babel:false,
        }, plugin.options || {})
    };
});


const mapSort={
    'es-vue':1,
    'es-javascript':49,
    'es-thinkphp':50,
    'es-php':100,
};

esPlugins.sort( (a,b)=>{
    a = mapSort[a.name] || 0;
    b = mapSort[b.name] || 0;
    return a < b ? -1 : a > b ? 1 : 0;
});

const vuePlugin = esPlugins.find( plugin => plugin.name === "es-vue" );
const builder = esPlugins.shift();
const rules = [
    {
        test: /\.es$/,
        use:[
            {
                loader:"es-loader",
                options:{
                    hot:process.env.NODE_ENV==="development",
                    watch:process.env.NODE_ENV==="development",
                    workspace:project_config.workspace,
                    output:project_config.output,
                    builder,
                    plugins:esPlugins
                }
            }
        ]
    },
    {
        test:/\.less$/i,
        use: [ 
            {
                loader: ExtractTextPlugin.loader,
                options: {
                    publicPath: publicPath
                },
            }, {
                loader: "css-loader"
            }, {
                loader: "less-loader"
            }
        ],
    },
    {
        test:/\.scss$/i,
        use: [ 
            {
                loader: ExtractTextPlugin.loader,
                options: {
                    publicPath: publicPath
                },
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader"
            }
        ],
    },
    {
        test: /\.css$/,
        use: [
            {
                loader: ExtractTextPlugin.loader,
                options: {
                    publicPath:publicPath
                },
            },
            'css-loader'
        ]
    },
    {
        test: /\.m?js$/,
        loader: 'babel-loader',
        options: {
            presets: [
                '@babel/preset-env',
                '@vue/babel-preset-jsx'
            ],
            plugins:[
                "@babel/plugin-transform-runtime"
            ]
        },
        exclude: [
            /(bower_components)/,
            /[\\\/]node_modules[\\\/]/,
        ]
    },
    {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        type:'asset'
    }
];

const resolve = project_config.resolve || {
    extensions:[".js", ".mjs", ".json",".css",".less",".scss",".sass",,".es"],
    alias: {}
};

resolve.modules = resolve.modules || [];
const node_modules_path = path.join(cwd,'node_modules');
if( !resolve.modules.includes( node_modules_path ) ){
    resolve.modules.push( node_modules_path );
}
if( !resolve.modules.includes( project_config.workspace ) ){
    resolve.modules.push( project_config.workspace );
}

const defineGlobalsVariable = {};
const plugins = [
    new htmlWebpackPlugin({
        "template": path.resolve(cwd, "index.html"),
    }),
    new webpackbar(),
    new ExtractTextPlugin({
        filename:'[name].min.css',
    })
];

if( vuePlugin ){
    const {VueLoaderPlugin} = require("vue-loader");
    plugins.push( new VueLoaderPlugin() );
    rules.push({
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            presets: ['@vue/babel-preset-jsx']
        },
    });
    defineGlobalsVariable.__VUE_OPTIONS_API__ = true;
    defineGlobalsVariable.__VUE_PROD_DEVTOOLS__ = false;
    if( !resolve.extensions.includes('.vue') ){
        resolve.extensions.push( '.vue' );
    }
    resolve.alias = Object.assign({
        'element-ui':path.join(cwd,'node_modules', 'element-ui'),
        'element-plus':path.join(cwd,'node_modules', 'element-plus'),
        'vue-demi':path.join(cwd,'node_modules', '@vueuse','shared','node_modules','vue-demi'),
    }, resolve.alias||{});
}

if( Object.values(defineGlobalsVariable).length > 0 ){
    plugins.push(new DefinePlugin(defineGlobalsVariable));
}
const output = (builder && builder.options ? builder.options.output : project_config.output) || project_config.output;
const webpack_config = {
    target:"web",
    entry:entryMap,
    output: {
        path: path.resolve(output),
        filename:`[name].js`,
        chunkFilename:`[name].js`,
        publicPath:publicPath,
    },
    resolve:resolve,
    module: {
        rules: rules
    },
    plugins: plugins,
    optimization:{
        removeEmptyChunks:true,
        usedExports:true
    }
};

if( project_config.chunk ){
    webpack_config.optimization.minimize = true;
    webpack_config.optimization.minimizer = [
        new TerserPlugin({extractComments:false}),
        new CSSMinimizerPlugin()
    ];
    webpack_config.optimization.splitChunks={
        chunks: 'all',
        minSize: 204800,
        minChunks:1,
        maxAsyncRequests: 5,
        maxInitialRequests: 30,
        enforceSizeThreshold:409600,
        name:false,
        cacheGroups: {
            vendor: {
                test:/[\\\/]node_modules[\\\/]/,
                priority:-20,
                name:"vendor",
            },
            ui: {
                test: /[\\\/]@?element-(ui|plus)[\\\/]/,
                priority:-15,
                name:"ui"
            },
            vue:{
                test:/[\\/]@?vue(.*?)[\\/]/,
                priority:-10,
                name:"vue",
            },
            css:{
                test:/\.(css|scss|sass|less)$/,
                name:"css",
            }
        }
    };
}

module.exports = {
    webpack_config,
    project_config
};