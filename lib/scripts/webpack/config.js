const path = require("path");
const fs = require("fs");
const {DefinePlugin} = require("webpack");
const webpackbar = require("webpackbar");
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const cwd = process.cwd();
const mode = process.env.NODE_ENV || 'production';
const esConfigFile = path.join( cwd ,'es.config.js');
const defdConfigfileMaps = {
    development:'webpack.config.dev.js',
    production:'webpack.config.prod.js',
    test:'webpack.config.test.js',
}
const getDefinitionWebpackConfig = (folder)=>{
    let webpackConfigFile = path.join(folder,defdConfigfileMaps[mode]||defdConfigfileMaps.production);
    let webpackConfigDef = null;
    if(fs.existsSync(webpackConfigFile)){
        webpackConfigDef = require(webpackConfigFile);
        if(typeof webpackConfigDef ==='function'){
            webpackConfigDef = webpackConfigDef(webpackConfigFile);
        }
        if(!webpackConfigDef || typeof webpackConfigDef !=='object'){
            throw new TypeError(`Invalid configuration should return an Object. in the '${webpackConfigFile}' file`)
        }
    }
    return webpackConfigDef;
}

const webpackConfigDef = getDefinitionWebpackConfig(cwd) || getDefinitionWebpackConfig(path.dirname(cwd)) || {};
const publicPath = webpackConfigDef.publicPath || '/';
const project_config = {
    workspace:path.join(cwd, 'src')
}

if(esConfigFile && fs.existsSync(esConfigFile)){
    Object.assign(project_config, require(esConfigFile)||{});
}

let entryFiles = webpackConfigDef.entry;
if( !entryFiles ){
    entryFiles = path.join(cwd, 'src', 'App.es' );
}

if(typeof entryFiles ==="string" && !path.isAbsolute( entryFiles ) ){
    entryFiles = path.resolve(project_config.workspace, entryFiles);
}

const outputConfig = {
    path:path.join(cwd,'build'), 
    filename:`[name].js`,
    chunkFilename:`[name].js`,
    publicPath:publicPath,
}
if(webpackConfigDef.output){
    if(typeof webpackConfigDef.output  ==='object'){
        Object.assign(outputConfig, webpackConfigDef.output)
    }else if(typeof webpackConfigDef.output  ==='string'){
        outputConfig.path = webpackConfigDef.output;
    }
}

if(!path.isAbsolute(outputConfig.path)){
    outputConfig.path = path.resolve(cwd, outputConfig.path);
}

const project_config_plugins = project_config.plugins || [];
const esPlugins = project_config_plugins.map( plugin=>{
    const name = plugin.name;
    return {
        name:name,
        plugin:typeof plugin.plugin === 'function' ? plugin.plugin : require(plugin.name),
        options:Object.assign({ 
            mode:process.env.NODE_ENV==='test' ? 'test' : mode,
            metadata:{
                env:process.env
            },
            hot:mode==='development' ? true : false,
            sourceMaps:mode==='development' ? true : false,
            output:project_config.output,
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
                    hot:mode==="development",
                    watch:mode==="development",
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
                loader: "sass-loader",
                options:{
                    sassOptions: {
                        includePaths:[project_config.workspace],
                        silenceDeprecations:['legacy-js-api']
                    },
                }
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

const node_modules_path = path.join(cwd,'node_modules');
const resolve = {
    extensions:[".es", ".js", ".mjs", ".json",".css",".less",".scss",".sass"],
    alias: {'element-plus':path.join(node_modules_path, 'element-plus')},
    modules:[node_modules_path]
};

const enabledCkeditor = fs.existsSync(path.join(node_modules_path,'@ckeditor/ckeditor5-dev-utils'));
if( enabledCkeditor ){
    const cssLoader = rules.find( loader=>loader.test instanceof RegExp ? loader.test.test('index.css') : false );
    const matchRegExp = /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/;
    if(cssLoader){
        cssLoader.exclude = matchRegExp;
    }
    const {getPostCssConfig} = require( path.join(node_modules_path,'@ckeditor/ckeditor5-dev-utils/lib/styles') );
    const ckeditor5ThemeLoader = {
        loader: 'postcss-loader',
        options: {
            postcssOptions:getPostCssConfig({
                themeImporter:{ 
                    themePath:require.resolve( path.join(node_modules_path,'@ckeditor/ckeditor5-theme-lark') ) 
                },
            })
        }
    }
    rules.push({
        test:matchRegExp,
        use:[
            {
                loader: ExtractTextPlugin.loader,
                options: {
                    publicPath:publicPath
                },
            },
            'css-loader',
            ckeditor5ThemeLoader
        ],
    });
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
    defineGlobalsVariable.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__=false;
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

const webpack_config = {
    mode,
    target:"web",
    entry:entryFiles,
    output:outputConfig,
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

if( webpackConfigDef.chunk ){
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

Object.keys(webpackConfigDef).forEach(key=>{
    if(key==='entry' || key==='output' || key==='chunk')return;
    if(key==='plugins'){
        webpack_config.plugins.push(...webpackConfigDef.plugins)
    }else if(key==='module'){
        Object.keys(webpackConfigDef.module).forEach(key=>{
            if(key==='rules'){
                webpack_config.module.rules.push(...webpackConfigDef.module.rules)
            }else{
                webpack_config.module[key] = webpackConfigDef.module[key];
            }
        })
    }else if(key==='resolve'){
        Object.keys(webpackConfigDef.resolve).forEach(key=>{
            if(key==='modules'){
                webpack_config.resolve.modules=webpackConfigDef.resolve.modules;
                webpack_config.resolve.modules.push(...defaultModules);
            }else{
                webpack_config.resolve[key] = webpackConfigDef.resolve[key];
            }
        })
    }else if(key==='optimization'){
        Object.assign(webpack_config.optimization, webpackConfigDef.optimization)
    }else{
        webpack_config[key] = webpackConfigDef[key]
    }
})

module.exports = {
    webpack_config,
    project_config
};