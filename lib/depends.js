const fs = require('fs');
const PATH = require('path');
const Utils = require('./utils.js');
const extend =  require('extend');
const chalk = require('chalk');
const package={
    "name": "Test",
    "version": "0.0.1",
    "description": "Test",
    "scripts": {
        "start": "node ./scripts/webpack --dev",
        "test": "node ./scripts/webpack --test",
        "build": "node ./scripts/webpack --build"
    },
    "devDependencies":{
      "easescript":"latest",
      "less": "^3.10.3",
      "chalk": "^4.0.0",
      "fs-extra": "^11.1.1",
    },
    "dependencies": {},
}

const webpackDeps ={
    "devDependencies": {
        "@babel/core": "^7.18.6",
        "@babel/plugin-transform-runtime": "^7.18.6",
        "@babel/preset-env": "^7.18.6",
        "@babel/runtime": "^7.19.4",
        "html-webpack-plugin": "^5.5.0",
        "mini-css-extract-plugin": "^2.4.5",
        "css-minimizer-webpack-plugin": "^5.0.1",
        "babel-loader": "^8.2.3",
        "file-loader": "^6.2.0",
        "style-loader": "^3.3.1",
        "sass-loader": "^13.2.0",
        "sass": "^1.63.4",
        "less-loader": "^11.1.0",
        "css-loader": "^6.5.1",
        "url-loader": "^4.1.1",
        "es-loader": "latest",
        "webpack": "^5.74.0",
        "webpack-dev-server": "^4.11.1",
        "webpackbar": "^5.0.2"
    }
};

const vue2Deps ={
    "devDependencies": {
        "@vue/babel-helper-vue-jsx-merge-props": "^1.2.1",
        "@vue/babel-preset-jsx": "^1.2.4",
        "@vue/compiler-sfc": "^2.7.13",
        "vue": "^2.7.14",
        "vue-hot-reload-api": "^2.3.4",
        "vue-loader": "^15.9.8",
        "vue-router": "^3.6.5",
        "vue-template-compiler": "^2.6.14",
        "element-ui": "^2.15.7",
        "es-vue": "latest"
    }
};

const vue3Deps ={
    "devDependencies": {
        "@vue/babel-helper-vue-jsx-merge-props": "^1.4.0",
        "@vue/babel-preset-jsx": "^1.4.0",
        "@vue/compiler-sfc": "^3.2.41",
        "@element-plus/icons-vue": "^2.1.0",
        "vue": "^3.2.40",
        "vue-loader": "^17.0.0",
        "vue-router": "^4.1.5",
        "vue-template-compiler": "^2.7.13",
        "element-plus": "^2.2.18",
        "es-vue": "latest"
    }
};

const javascriptDeps = {
    "devDependencies": {
        "es-javascript": "latest",
    }
}

const phpDeps = {
    "devDependencies": {
        "es-php": "latest",
    }
}

const thinkphpDeps = {
    "devDependencies": {
        "es-thinkphp": "latest"
    }
}

const nuxt = {
    "scripts": {
        "build": "nuxt build",
        "start": "nuxt dev",
        "generate": "nuxt generate",
        "preview": "nuxt preview",
        "postinstall": "nuxt prepare",
    },
    "devDependencies": {
        "@vue/babel-helper-vue-jsx-merge-props": "^1.4.0",
        "@vue/babel-preset-jsx": "^1.4.0",
        "@vue/compiler-sfc": "^3.2.41",
        "@element-plus/icons-vue": "^2.1.0",
        "@nuxt/devtools": "latest",
        "easescript": "latest",
        "element-plus": "^2.3.9",
        "es-vite-plugin": "latest",
        "es-nuxt": "latest",
        "nuxt": "^3.6.5",
    }
}

const uniapp = {
    "scripts": {
        "serve": "npm run dev:h5",
        "build": "npm run build:h5",
        "build:app-plus": "cross-env NODE_ENV=production UNI_PLATFORM=app-plus vue-cli-service uni-build",
        "build:custom": "cross-env NODE_ENV=production uniapp-cli custom",
        "build:h5": "cross-env NODE_ENV=production UNI_PLATFORM=h5 vue-cli-service uni-build",
        "build:mp-360": "cross-env NODE_ENV=production UNI_PLATFORM=mp-360 vue-cli-service uni-build",
        "build:mp-alipay": "cross-env NODE_ENV=production UNI_PLATFORM=mp-alipay vue-cli-service uni-build",
        "build:mp-baidu": "cross-env NODE_ENV=production UNI_PLATFORM=mp-baidu vue-cli-service uni-build",
        "build:mp-jd": "cross-env NODE_ENV=production UNI_PLATFORM=mp-jd vue-cli-service uni-build",
        "build:mp-kuaishou": "cross-env NODE_ENV=production UNI_PLATFORM=mp-kuaishou vue-cli-service uni-build",
        "build:mp-lark": "cross-env NODE_ENV=production UNI_PLATFORM=mp-lark vue-cli-service uni-build",
        "build:mp-qq": "cross-env NODE_ENV=production UNI_PLATFORM=mp-qq vue-cli-service uni-build",
        "build:mp-toutiao": "cross-env NODE_ENV=production UNI_PLATFORM=mp-toutiao vue-cli-service uni-build",
        "build:mp-weixin": "cross-env NODE_ENV=production UNI_PLATFORM=mp-weixin vue-cli-service uni-build",
        "build:mp-xhs": "cross-env NODE_ENV=production UNI_PLATFORM=mp-xhs vue-cli-service uni-build",
        "build:quickapp-native": "cross-env NODE_ENV=production UNI_PLATFORM=quickapp-native vue-cli-service uni-build",
        "build:quickapp-webview": "cross-env NODE_ENV=production UNI_PLATFORM=quickapp-webview vue-cli-service uni-build",
        "build:quickapp-webview-huawei": "cross-env NODE_ENV=production UNI_PLATFORM=quickapp-webview-huawei vue-cli-service uni-build",
        "build:quickapp-webview-union": "cross-env NODE_ENV=production UNI_PLATFORM=quickapp-webview-union vue-cli-service uni-build",
        "dev:app-plus": "cross-env NODE_ENV=development UNI_PLATFORM=app-plus vue-cli-service uni-build --watch",
        "dev:custom": "cross-env NODE_ENV=development uniapp-cli custom",
        "dev:h5": "cross-env NODE_ENV=development UNI_PLATFORM=h5 vue-cli-service uni-serve",
        "dev:mp-360": "cross-env NODE_ENV=development UNI_PLATFORM=mp-360 vue-cli-service uni-build --watch",
        "dev:mp-alipay": "cross-env NODE_ENV=development UNI_PLATFORM=mp-alipay vue-cli-service uni-build --watch",
        "dev:mp-baidu": "cross-env NODE_ENV=development UNI_PLATFORM=mp-baidu vue-cli-service uni-build --watch",
        "dev:mp-jd": "cross-env NODE_ENV=development UNI_PLATFORM=mp-jd vue-cli-service uni-build --watch",
        "dev:mp-kuaishou": "cross-env NODE_ENV=development UNI_PLATFORM=mp-kuaishou vue-cli-service uni-build --watch",
        "dev:mp-lark": "cross-env NODE_ENV=development UNI_PLATFORM=mp-lark vue-cli-service uni-build --watch",
        "dev:mp-qq": "cross-env NODE_ENV=development UNI_PLATFORM=mp-qq vue-cli-service uni-build --watch",
        "dev:mp-toutiao": "cross-env NODE_ENV=development UNI_PLATFORM=mp-toutiao vue-cli-service uni-build --watch",
        "dev:mp-weixin": "cross-env NODE_ENV=development UNI_PLATFORM=mp-weixin vue-cli-service uni-build --watch --skip-plugins @dcloudio/vue-cli-plugin-uni",
        "dev:mp-xhs": "cross-env NODE_ENV=development UNI_PLATFORM=mp-xhs vue-cli-service uni-build --watch",
        "dev:quickapp-native": "cross-env NODE_ENV=development UNI_PLATFORM=quickapp-native vue-cli-service uni-build --watch",
        "dev:quickapp-webview": "cross-env NODE_ENV=development UNI_PLATFORM=quickapp-webview vue-cli-service uni-build --watch",
        "dev:quickapp-webview-huawei": "cross-env NODE_ENV=development UNI_PLATFORM=quickapp-webview-huawei vue-cli-service uni-build --watch",
        "dev:quickapp-webview-union": "cross-env NODE_ENV=development UNI_PLATFORM=quickapp-webview-union vue-cli-service uni-build --watch",
        "info": "node node_modules/@dcloudio/vue-cli-plugin-uni/commands/info.js",
        "serve:quickapp-native": "node node_modules/@dcloudio/uni-quickapp-native/bin/serve.js",
        "test:android": "cross-env UNI_PLATFORM=app-plus UNI_OS_NAME=android jest -i",
        "test:h5": "cross-env UNI_PLATFORM=h5 jest -i",
        "test:ios": "cross-env UNI_PLATFORM=app-plus UNI_OS_NAME=ios jest -i",
        "test:mp-baidu": "cross-env UNI_PLATFORM=mp-baidu jest -i",
        "test:mp-weixin": "cross-env UNI_PLATFORM=mp-weixin jest -i"
    },
    "dependencies": {
        "@dcloudio/uni-app": "^2.0.2-3080420230530001",
        "@dcloudio/uni-app-plus": "^2.0.2-3080420230530001",
        "@dcloudio/uni-h5": "^2.0.2-3080420230530001",
        "@dcloudio/uni-i18n": "^2.0.2-3080420230530001",
        "@dcloudio/uni-mp-360": "^2.0.2-3080420230530001",
        "@dcloudio/uni-mp-alipay": "^2.0.2-3080420230530001",
        "@dcloudio/uni-mp-baidu": "^2.0.2-3080420230530001",
        "@dcloudio/uni-mp-jd": "^2.0.2-3080420230530001",
        "@dcloudio/uni-mp-kuaishou": "^2.0.2-3080420230530001",
        "@dcloudio/uni-mp-lark": "^2.0.2-3080420230530001",
        "@dcloudio/uni-mp-qq": "^2.0.2-3080420230530001",
        "@dcloudio/uni-mp-toutiao": "^2.0.2-3080420230530001",
        "@dcloudio/uni-mp-vue": "^2.0.2-3080420230530001",
        "@dcloudio/uni-mp-weixin": "^2.0.2-3080420230530001",
        "@dcloudio/uni-mp-xhs": "^2.0.2-3080420230530001",
        "@dcloudio/uni-quickapp-native": "^2.0.2-3080420230530001",
        "@dcloudio/uni-quickapp-webview": "^2.0.2-3080420230530001",
        "@dcloudio/uni-stacktracey": "^2.0.2-3080420230530001",
        "@dcloudio/uni-stat": "^2.0.2-3080420230530001",
        "@dcloudio/uni-ui": "^1.4.28",
        "@vue/shared": "^3.0.0",
        "core-js": "^3.8.3",
        "flyio": "^0.6.2",
        "vue": ">= 2.6.14 < 2.7",
        "vuex": "^3.2.0"
    },
    "devDependencies": {
        "@dcloudio/types": "^3.3.2",
        "@dcloudio/uni-automator": "^2.0.2-3080420230530001",
        "@dcloudio/uni-cli-i18n": "^2.0.2-3080420230530001",
        "@dcloudio/uni-cli-shared": "^2.0.2-3080420230530001",
        "@dcloudio/uni-helper-json": "*",
        "@dcloudio/uni-migration": "^2.0.2-3080420230530001",
        "@dcloudio/uni-template-compiler": "^2.0.2-3080420230530001",
        "@dcloudio/vue-cli-plugin-hbuilderx": "^2.0.2-3080420230530001",
        "@dcloudio/vue-cli-plugin-uni": "^2.0.2-3080420230530001",
        "@dcloudio/vue-cli-plugin-uni-optimize": "^2.0.2-3080420230530001",
        "@dcloudio/webpack-uni-mp-loader": "^2.0.2-3080420230530001",
        "@dcloudio/webpack-uni-pages-loader": "^2.0.2-3080420230530001",
        "@vue/cli-plugin-babel": "~5.0.0",
        "@vue/cli-service": "~5.0.0",
        "babel-plugin-import": "^1.11.0",
        "cross-env": "^7.0.2",
        "es-uniapp": "latest",
        "es-loader": "latest",
        "jest": "^25.4.0",
        "mini-types": "*",
        "miniprogram-api-typings": "*",
        "postcss-comment": "^2.0.0",
        "sass": "^1.49.8",
        "sass-loader": "^8.0.2",
        "vue-template-compiler": ">= 2.6.14 < 2.7"
    },
    "browserslist": [
        "Android >= 4.4",
        "ios >= 9"
    ],
    "uni-app": {
        "scripts": {}
    },
    "vuePlugins": {
        "service": [
            "es-uniapp/lib/es-plugin.js"
        ]
    }
}


const ckeditorDeps = {
    "devDependencies": {

        "@ckeditor/ckeditor5-build-classic": "^40.0.0",
        "@ckeditor/ckeditor5-build-decoupled-document": "^40.0.0",
        "@ckeditor/ckeditor5-editor-balloon": "^40.0.0",
        "@ckeditor/ckeditor5-editor-decoupled": "^40.0.0",
        "@ckeditor/ckeditor5-editor-inline": "^40.0.0",
        "@ckeditor/ckeditor5-editor-multi-root": "^40.0.0",
        "@ckeditor/ckeditor5-theme-lark": "^40.0.0",

        //plugins
        "@ckeditor/ckeditor5-adapter-ckfinder":"^40.0.0",
        "@ckeditor/ckeditor5-alignment":"^40.0.0",
        "@ckeditor/ckeditor5-autoformat":"^40.0.0",
        "@ckeditor/ckeditor5-basic-styles":"^40.0.0",
        "@ckeditor/ckeditor5-block-quote":"^40.0.0",
        "@ckeditor/ckeditor5-build-classic":"^40.0.0",
        "@ckeditor/ckeditor5-ckbox":"^40.0.0",
        "@ckeditor/ckeditor5-ckfinder":"^40.0.0",
        "@ckeditor/ckeditor5-clipboard":"^40.0.0",
        "@ckeditor/ckeditor5-cloud-services":"^40.0.0",
        "@ckeditor/ckeditor5-core":"^40.0.0",
        "@ckeditor/ckeditor5-easy-image":"^40.0.0",
        "@ckeditor/ckeditor5-editor-classic":"^40.0.0",
        "@ckeditor/ckeditor5-editor-inline":"^40.0.0",
        "@ckeditor/ckeditor5-engine":"^40.0.0",
        "@ckeditor/ckeditor5-enter":"^40.0.0",
        "@ckeditor/ckeditor5-essentials":"^40.0.0",
        "@ckeditor/ckeditor5-font":"^40.0.0",
        "@ckeditor/ckeditor5-heading":"^40.0.0",
        "@ckeditor/ckeditor5-image":"^40.0.0",
        "@ckeditor/ckeditor5-indent":"^40.0.0",
        "@ckeditor/ckeditor5-link":"^40.0.0",
        "@ckeditor/ckeditor5-list":"^40.0.0",
        "@ckeditor/ckeditor5-media-embed":"^40.0.0",
        "@ckeditor/ckeditor5-paragraph":"^40.0.0",
        "@ckeditor/ckeditor5-paste-from-office":"^40.0.0",
        "@ckeditor/ckeditor5-select-all":"^40.0.0",
        "@ckeditor/ckeditor5-table":"^40.0.0",
        "@ckeditor/ckeditor5-typing":"^40.0.0",
        "@ckeditor/ckeditor5-ui":"^40.0.0",
        "@ckeditor/ckeditor5-undo":"^40.0.0",
        "@ckeditor/ckeditor5-upload":"^40.0.0",
        "@ckeditor/ckeditor5-utils":"^40.0.0",
        "@ckeditor/ckeditor5-watchdog":"^40.0.0",
        "@ckeditor/ckeditor5-widget":"^40.0.0"
    }
}

const ckditorViteDeps={
    "devDependencies": {
        "@ckeditor/vite-plugin-ckeditor5": "^0.1.3",
		"@rollup/plugin-commonjs": "^25.0.7",
    }
}

const ckditorWebpackDeps={
    "devDependencies": {
        "@ckeditor/ckeditor5-dev-utils": "^39.2.0",
    }
}

const identifery = /^[a-zA-Z]\w+$/;

function stringify(config , depth=1, isJson=false){
    var type = config instanceof Array ? 'array' : typeof config;
    if( type ==="string" ){
        if( config.indexOf('require(')===0 ){
            return config;
        }
        return `"${config.replace(/\\/g, '/')}"`;
    }
    if( type==="number" || type==="boolean" || config instanceof RegExp)return String(config);
    var item = [];
    for( var p in config ){
        if( type ==="array" ){
            item.push( stringify( config[p] , depth+1, isJson ) );
        }else if( type ==="object" ){
            if(isJson || !identifery.test(p) ){
                item.push( '"'+p+'":'+stringify( config[p] , depth+1, isJson ) );
            }else{
                item.push( p+':'+stringify( config[p] , depth+1, isJson ) );
            }
        }
    }
    var tab = new Array( depth+1 );
    tab = tab.join("\t");
    var end = new Array( depth );
    end = end.join("\t");
    if( type ==='array' ){
        return `[\r\n${tab}${item.join(`,\r\n${tab}`)}\r\n${end}]`;
    }
    return `{\r\n${tab}${item.join(`,\r\n${tab}`)}\r\n${end}}`;
}

function resolvePath( dirname ){
    if( !PATH.isAbsolute( dirname ) ){
        dirname = PATH.resolve( process.cwd(), dirname );
    }
    if( !fs.existsSync( dirname ) ){
        dirname = Utils.mkdir( dirname );
    }
    return Utils.normalizePath( dirname );
}

function relativePath( dirname , base=process.cwd() ){
    return Utils.normalizePath( PATH.relative( base, dirname) );
}

function checkComposer(){
    const res = Utils.exec(`composer --version`, {stdio:'pipe'});
    if(res){
        return !(res instanceof Error);
    }
    return false
}

function installThinkPHP(output){
    return (yes)=>{
        const name = PATH.basename(output);
        if( Utils.isDir(output) ){
            if( Utils.readdir( output ).length > 0 ){
                if( yes ){
                    console.info( chalk.bgYellow(`\r\nthinkphp frameworks was not initialized, because the '${name}' directory is not empty.`) );
                    return false;
                }
            }
        }
        if( yes && checkComposer() ){
            const res = Utils.exec(
                `composer create-project topthink/think=6.x.x ${name}`,
                {
                    cwd:PATH.resolve(PATH.dirname(output)),
                    stdio: [null,1,2]
                }
            );
            if(res && res instanceof Error){
                console.info( chalk.bgRed( `\r\n${res.message}` ) );
                return false;
            }
            return true;
        }else{
            if(yes){
                console.info( chalk.bgRed(`\r\nNot found composer. needs to manually install it.`) );
            }
            console.info( chalk.bgYellow(`\r\nAfter successfully installing the composer, follow these steps:`) );
            console.info( chalk.yellow(`1、cd ${PATH.dirname(output)}`) );
            console.info( chalk.yellow(`2、composer create-project topthink/think=6.x.x ${name}`) );
            return true;
        }
    };
}

function create(config){

    const tasks = [];
    config.project_path = resolvePath( config.project_path );
    if( !PATH.isAbsolute( config.build_path ) ){
        config.build_path = resolvePath( PATH.resolve( config.project_path, config.build_path ) ); 
    }else{
        config.build_path = resolvePath( config.build_path );
    }

    var packageinfo = extend(true, package);
    packageinfo.name = PATH.basename( config.project_path );
    packageinfo.description = config.description || packageinfo.name;
    packageinfo.author = config.author || packageinfo.name;

    if( config.installCkeditor ){
        packageinfo = extend(true, packageinfo, ckeditorDeps)
        if( config.plugins.includes('es-nuxt') ){
            packageinfo = extend(true, packageinfo, ckditorViteDeps)
        }else{
            packageinfo = extend(true, packageinfo, ckditorWebpackDeps)
        }
    }

    const pluginOptions = {};
    const hasClient = config.plugins.some( plugin=>{
        return ['es-vue','es-javascript','es-nuxt','es-uniapp'].includes( plugin );
    });
    const scripts = {
        'es':true,
        'rollup':true,
        'webpack':true,
    };
    const updateScripts = (plugin)=>{
        if( config.plugins.length === 1 ){
            if( plugin ==="es-javascript"){
                extend(true, packageinfo.scripts, {
                    "start": "node ./scripts/es --dev",
                    "build": "node ./scripts/es --build",
                    "test": "node ./scripts/es --test"
                });
                scripts['webpack'] = false;
            }else if( plugin==="es-thinkphp" || plugin==="es-php" ){
                extend(true, packageinfo.scripts, {
                    "start": "node ./scripts/es --dev",
                    "build": "node ./scripts/es --build",
                    "test": "node ./scripts/es --test"
                });
                scripts['webpack'] = false;
                scripts['rollup'] = false;
                if(plugin==="es-thinkphp"){
                    tasks.push(installThinkPHP(packageinfo.build_path));
                }
            }
            pluginOptions[ plugin ]= Object.assign(pluginOptions[ plugin ] || {}, {
                output:relativePath(config.build_path, config.project_path),
            });
        }else{
            if( plugin==="es-thinkphp" || plugin==="es-php" ){
                const output = resolvePath(PATH.join(config.build_path, 'server'));
                pluginOptions[ plugin ]=Object.assign(pluginOptions[ plugin ] || {},{
                    output:{
                        dev:relativePath(output , config.project_path),
                        prod:relativePath(output , config.project_path),
                    },
                });
                if( plugin==="es-thinkphp" ){
                    tasks.push( installThinkPHP(output) );
                }
            }else{
                const output = resolvePath(PATH.join(config.build_path,'front'));
                pluginOptions[ plugin ]= Object.assign(pluginOptions[ plugin ] || {}, {
                    output:relativePath(output,config.project_path),
                });
            }
        }

        if( plugin==="es-vue" ){
            extend(true, packageinfo.scripts, {
                "es:build": "node ./scripts/es --build",
                //"rollup:build": "node ./scripts/rollup --build",
            });
        }else if( plugin==="es-nuxt"){
            delete packageinfo.scripts.test
            scripts['es'] = false;
            scripts['webpack'] = false;
            scripts['rollup'] = false;
        }else if( plugin==="es-uniapp"){
            scripts['es'] = false;
            scripts['webpack'] = false;
            scripts['rollup'] = false;
        }
    }

    config.plugins.forEach( plugin=>{
        if( plugin==="es-vue" ){
            extend(true, packageinfo, webpackDeps);
            if( config.vue_version ==="vue@2" ){
                packageinfo = extend(true, packageinfo, vue2Deps);
            }else{
                packageinfo = extend(true, packageinfo, vue3Deps);
            }
            pluginOptions[ plugin ]={
                version:config.vue_version ==="vue@2" ? '2.0.0' : '3.0.0',
                optimize:true,
                webpack:true,
                styleLoader: ['style-loader','css-loader'],
                useAbsolutePathImport:true,
                sourceMaps:false,
                babel:false,
            };
            updateScripts(plugin);
            Utils.copyfile( PATH.join(__dirname, "template/client"), PATH.join(config.project_path));
        }else if( plugin==="es-nuxt" ){
            packageinfo = extend(true, packageinfo, nuxt);
            pluginOptions[ plugin ]={
                version:'3.0.0',
                optimize:true,
                webpack:true,
                useAbsolutePathImport:true,
                sourceMaps:false,
                babel:false,
            };
            updateScripts(plugin);
            Utils.copyfile( PATH.join(__dirname, "template/nuxt"), PATH.join(config.project_path));
        }else if( plugin==="es-uniapp" ){
            packageinfo = extend(true, packageinfo, uniapp);
            pluginOptions[ plugin ]={
                version:'3.0.0',
                optimize:true,
                webpack:true,
                styleLoader: ['style-loader','css-loader'],
                useAbsolutePathImport:true,
                sourceMaps:false,
                babel:false,
            };
            updateScripts(plugin);
            Utils.copyfile( PATH.join(__dirname, "template/uniapp"), PATH.join(config.project_path));
        }else if( plugin==="es-thinkphp" ){
            extend(true, packageinfo, thinkphpDeps);
            if(hasClient){
                pluginOptions[ plugin ]={
                    import:true,
                    useAbsolutePathImport:false,
                    includes:[
                        'api/config/*',
                        'api/lang/*',
                        'api/console/*',
                        'api/middleware.es'
                    ],
                    context:{
                        include:[/([\\\/]|^)api([\\\/])/],
                        only:true
                    },
                    resolve:{
                        using:[],
                        mapping:{
                            namespace:{
                                "es.**":"app.system",
                            },
                            folder:{
                                '****.es::controller':'app/%1...',
                                '****.es::model':'app/%1...',
                                '****.es::router':'route',
                                '****.es::global':'system',
                                '*/middleware.es::*':'app/%1...',
                                '*/lang/*.es::*':'app/lang',
                                '*/config/*.es::*':'config',
                                '*/console/*.es::*':'app/console',
                                '*/middleware/*.es::*':'app/middleware',
                                '*/*/lang/*.es::*':'app/%1/lang',
                                '*/*/config/*.es::*':'app/%1/config',
                                '*/*/console/*.es::*':'app/%1/console',
                                '*/*/middleware/*.es::*':'app/%1/middleware',
                            }
                        }
                    }
                };
                Utils.copyfile( PATH.join(__dirname, "template/api/src"), Utils.mkdir( PATH.join(config.project_path,'src/api') ) );
            }else{
                pluginOptions[ plugin ]={
                    import:true,
                    useAbsolutePathImport:false,
                    includes:['config/*', 'lang/*','middleware/*','console/*'],
                    resolve:{
                        using:[],
                        mapping:{
                            namespace:{},
                            folder:{
                                '****.es::router':'route',
                            }
                        }
                    }
                };
                Utils.copyfile( PATH.join(__dirname, "template/server/src"), Utils.mkdir( PATH.join(config.project_path,'src') ) );
            }
            updateScripts( plugin );
        }else if( plugin==="es-php" ){
            if( hasClient ){
                const api = Utils.mkdir( PATH.join(config.project_path,'src/api') );
                Utils.copyfile( PATH.join(__dirname, "template/api/Index.es"), PATH.join(api,'Index.es') );
            }else{
                const src = Utils.mkdir( PATH.join(config.project_path,'src') );
                Utils.copyfile( PATH.join(__dirname, "template/App.es"), PATH.join(src, 'App.es'));
            }
            extend(true, packageinfo, phpDeps);
            updateScripts( plugin );
        }else if( plugin==="es-javascript" ){
            const src = Utils.mkdir( PATH.join(config.project_path,'src') );
            Utils.copyfile( PATH.join(__dirname, "template/App.es"), PATH.join(src,'App.es'));
            extend(true, packageinfo, javascriptDeps);
            updateScripts( plugin );
        }
    });

    const hasNuxt = config.plugins.includes('es-nuxt');
    Utils.mkdir(PATH.join(config.project_path,"scripts"));
    Object.keys(scripts).filter( key=>!!scripts[key] ).forEach( name=>{
        Utils.copyfile( PATH.join(__dirname, "scripts", name),  Utils.mkdir(PATH.join(config.project_path,"scripts",name)));
    });
    Utils.copyfile( PATH.join(__dirname, "scripts", 'server.js'),  PATH.join(config.project_path,"scripts",'server.js') );
    if(hasNuxt){
        Utils.copyfile( PATH.join(__dirname, "scripts", 'nuxt.js'),  PATH.join(config.project_path,"scripts",'readyHook.js') );
    }

    const webConfig = {
        workspace:Utils.normalizePath( relativePath( PATH.join(config.project_path,"src"), config.project_path) ),
        output:relativePath(config.build_path, config.project_path),
        chunk:true,
        bootstrap:'App.es',
        publicPath:'/',
        plugins:config.plugins.map( plugin => {
            const options = pluginOptions[plugin]||{};
            return {
                'name':plugin,
                'plugin':`require("${plugin}")`,
                'options':options
            };
        })
    };

    if( hasNuxt ){
        webConfig.annotations=['Redirect'];
    }

    if( scripts.webpack || hasNuxt ){
        webConfig.devServer={
            open:true,
            hot:true,
            proxy: {
                '/api': {
                    target: 'http://localhost:8000',
                    pathRewrite: { '^/api': '' },
                },
            },
        }
    }

    fs.writeFileSync( PATH.join(config.project_path, "package.json"), stringify(packageinfo, 1, true));
    fs.writeFileSync( PATH.join(config.project_path, "es.config.js"), `module.exports = ` + stringify(webConfig));
    return [config, tasks];
}

module.exports = create;