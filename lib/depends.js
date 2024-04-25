const fs = require('fs-extra');
const PATH = require('path');
const Utils = require('./utils.js');
const extend =  require('extend');
const chalk = require('chalk');
const package={
    "name": "Test",
    "version": "0.0.1",
    "description": "Test",
    "scripts": {},
    "devDependencies":{
        "easescript":"latest",
        "easescript-cli":"latest",
        "sass": "^1.63.4",
        "less": "^4.1.3",
    },
    "dependencies": {},
}

const scriptsDeps={
    "devDependencies":{
        "chalk": "^4.0.0",
        "fs-extra": "^11.1.1",
    }
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
        "less-loader": "^11.1.0",
        "css-loader": "^6.5.1",
        "url-loader": "^4.1.1",
        "es-loader": "latest",
        "webpack": "^5.74.0",
        "webpack-dev-server": "^4.11.1",
        "webpackbar": "^5.0.2"
    }
};

const javascriptDeps = {
    "devDependencies": {
        "@babel/core": "^7.17.10",
        "@babel/plugin-transform-runtime": "^7.18.6",
        "@babel/preset-env": "^7.18.6",
        "@babel/runtime-corejs3": "^7.17.9",
        "es-javascript": "latest",
        "axios": "^0.26.1",
        "blueimp-md5": "^2.19.0",
        "js-base64": "^3.7.2",
        "js-cookie": "^3.0.1",
        "moment": "^2.29.4"
    }
}

const vue2Deps ={
    "devDependencies": {
        "@vue/babel-helper-vue-jsx-merge-props": "^1.2.1",
        "@vue/babel-preset-jsx": "^1.2.4",
        "@vue/compiler-sfc": "^2.7.13",
        "vue": "^2.7.14",
        "vue-hot-reload-api": "^2.3.4",
        "vue-loader": "^15.9.8",
        "vue-router": "^3.6.5",
        "vue-template-compiler": "^2.7.16",
        "element-ui": "^2.15.7",
        "pinia": "^2.1.7",
        "es-vue": "latest"
    }
};

const vue3Deps ={
    "devDependencies":{
        "@element-plus/icons-vue": "^2.3.1",
        "element-plus": "^2.7.0",
        "vue-loader": "^17.4.2",
        "vue-router": "^4.3.0",
        "pinia": "^2.1.7",
        "vue":"^3.3.4",
        "es-vue": "latest"
    }
};

const phpDeps = {
    "devDependencies": {
        "es-php": "latest",
    }
}

const phpBunbleDeps = {
    "devDependencies": {
        "rollup": "^4.14.1",
        "node-sass": "^7.0.1",
        "@rollup/plugin-commonjs": "^25.0.7",
        "@rollup/plugin-node-resolve": "^15.2.3"
    }
}

const thinkphpDeps = {
    "devDependencies": {
        "es-thinkphp": "latest"
    }
}

const nuxt = {
    "scripts": {
        "dev": "cross-env VITE_CJS_IGNORE_WARNING=true nuxt dev",
        "build": "cross-env VITE_CJS_IGNORE_WARNING=true nuxt build",
        "generate": "cross-env VITE_CJS_IGNORE_WARNING=true nuxt generate",
        "preview": "cross-env VITE_CJS_IGNORE_WARNING=true nuxt preview",
        "postinstall": "cross-env VITE_CJS_IGNORE_WARNING=true nuxt prepare",
    },
    "devDependencies": {
        "@element-plus/nuxt": "^1.0.8",
        "es-vite-plugin": "latest",
        "es-nuxt": "latest",
        "cross-env": "^7.0.3",
        "lodash": "^4.17.21",
        "nuxt": "^3.11.2",
        "vue": "^3.4.21",
        "vue-router": "^4.3.0"
    }
};

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

        "@ckeditor/ckeditor5-build-classic": "^41.1.0",
        "@ckeditor/ckeditor5-build-decoupled-document": "^41.1.0",
        "@ckeditor/ckeditor5-editor-balloon": "^41.1.0",
        "@ckeditor/ckeditor5-editor-decoupled": "^41.1.0",
        "@ckeditor/ckeditor5-editor-inline": "^41.1.0",
        "@ckeditor/ckeditor5-editor-multi-root": "^41.1.0",
        "@ckeditor/ckeditor5-theme-lark": "^41.1.0",

        //plugins
        "@ckeditor/ckeditor5-adapter-ckfinder":"^41.1.0",
        "@ckeditor/ckeditor5-alignment":"^41.1.0",
        "@ckeditor/ckeditor5-autoformat":"^41.1.0",
        "@ckeditor/ckeditor5-basic-styles":"^41.1.0",
        "@ckeditor/ckeditor5-block-quote":"^41.1.0",
        "@ckeditor/ckeditor5-build-classic":"^41.1.0",
        "@ckeditor/ckeditor5-code-block":"^41.1.0",
        "@ckeditor/ckeditor5-ckbox":"^41.1.0",
        "@ckeditor/ckeditor5-ckfinder":"^41.1.0",
        "@ckeditor/ckeditor5-clipboard":"^41.1.0",
        "@ckeditor/ckeditor5-cloud-services":"^41.1.0",
        "@ckeditor/ckeditor5-core":"^41.1.0",
        "@ckeditor/ckeditor5-easy-image":"^41.1.0",
        "@ckeditor/ckeditor5-editor-classic":"^41.1.0",
        "@ckeditor/ckeditor5-editor-inline":"^41.1.0",
        "@ckeditor/ckeditor5-source-editing":"^41.1.0",
        "@ckeditor/ckeditor5-engine":"^41.1.0",
        "@ckeditor/ckeditor5-enter":"^41.1.0",
        "@ckeditor/ckeditor5-essentials":"^41.1.0",
        "@ckeditor/ckeditor5-font":"^41.1.0",
        "@ckeditor/ckeditor5-heading":"^41.1.0",
        "@ckeditor/ckeditor5-image":"^41.1.0",
        "@ckeditor/ckeditor5-indent":"^41.1.0",
        "@ckeditor/ckeditor5-link":"^41.1.0",
        "@ckeditor/ckeditor5-list":"^41.1.0",
        "@ckeditor/ckeditor5-media-embed":"^41.1.0",
        "@ckeditor/ckeditor5-paragraph":"^41.1.0",
        "@ckeditor/ckeditor5-paste-from-office":"^41.1.0",
        "@ckeditor/ckeditor5-select-all":"^41.1.0",
        "@ckeditor/ckeditor5-table":"^41.1.0",
        "@ckeditor/ckeditor5-typing":"^41.1.0",
        "@ckeditor/ckeditor5-ui":"^41.1.0",
        "@ckeditor/ckeditor5-undo":"^41.1.0",
        "@ckeditor/ckeditor5-upload":"^41.1.0",
        "@ckeditor/ckeditor5-utils":"^41.1.0",
        "@ckeditor/ckeditor5-watchdog":"^41.1.0",
        "@ckeditor/ckeditor5-widget":"^41.1.0"
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

function stringify(config , depth=1, isJson=false, pushComment=null){
    const isDesc = isDescriptor(config);
    if(isDesc){
        if(config.comment && !isJson && pushComment){
            if(Array.isArray(config.comment)){
                pushComment(['/*',...config.comment.map( val=>'* '+val),'*/'])
            }else{
                pushComment(['//'+config.comment])
            }
        }
        config = config.value;
    }
    var type = config instanceof Array ? 'array' : typeof config;
    if( type ==="string" ){
        if( config.indexOf('require(')===0 ){
            return config;
        }
        return `"${config.replace(/\\/g, '/')}"`;
    }
    if( type==="number" || type==="boolean" || config===null || config===undefined || config instanceof RegExp)return String(config);
    let item=[];
    const _pushComment = (comments)=>{
        item.push(comments)
    }
    for( var p in config ){
        const result = stringify(config[p] , depth+1, isJson , _pushComment);
        if( type ==="array" ){
            item.push(result);
        }else if( type ==="object" ){
            if(isJson || !identifery.test(p) ){
                item.push( '"'+p+'":'+result );
            }else{
                item.push( p+':'+result );
            }
        }
    }
    const tab = new Array( depth+1).join("\t");
    const end = new Array( depth ).join("\t");
    const last = item.length-1;
    const segs = item.map((value,index)=>{
        if(Array.isArray(value)){
            value = value.join(`\n${tab}`)
        }
        const ends = last === index ? `\n${end}` : '';
        const comma = index===0 || Array.isArray(item[index-1]) ? '' : ',';
        return `${comma}\n${tab}${value}${ends}`;
    });
    if( type ==='array' ){
        return `[${segs.join(``)}]`;
    }
    return `{${segs.join(``)}}`;
}

function resolvePath( dirname ){
    if(!PATH.isAbsolute(dirname)){
        dirname = PATH.join(process.cwd(), dirname);
    }
    fs.mkdirSync(dirname, {recursive:true})
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

const descriptorKey = Symbol('descriptor');
function getDescriptor(value, comment){
    return {
        [descriptorKey]:true,
        value,
        comment
    }
}

function isDescriptor(object){
    if(!object || typeof object !=='object')return false;
    return object[descriptorKey];
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
    const updateScripts = (plugin)=>{
        if( config.plugins.length === 1 ){
            if( plugin ==="es-javascript"){
                extend(true, packageinfo.scripts, {
                    "dev": "esc -f App.es -m development",
                    "test": "esc -f App.es -m test",
                    "build": "esc -f App.es -m production"
                   
                });
            }else if( plugin==="es-thinkphp" || plugin==="es-php" ){
                let file = 'Index.es';
                if(plugin==="es-thinkphp"){
                    file = 'app/controller'
                }
                extend(true, packageinfo.scripts, {
                    "dev": `esc -f ${file} -m development`,
                    "test": `esc -f ${file} -m test`,
                    "build": `esc -f ${file} -m production`
                });
                if(plugin==="es-thinkphp"){
                    tasks.push(installThinkPHP(config.build_path));
                }
                extend(true, packageinfo, phpBunbleDeps);
            }
            pluginOptions[ plugin ]= Object.assign(pluginOptions[ plugin ] || {}, {
                output:relativePath(config.build_path, config.project_path),
            });
        }else{
            if( plugin==="es-thinkphp" || plugin==="es-php" ){
                const output = resolvePath(PATH.join(config.build_path, 'server'));
                pluginOptions[ plugin ]=Object.assign(pluginOptions[ plugin ] || {},{
                    output:relativePath(output , config.project_path)
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
                "dev": "node ./scripts/webpack --dev",
                "test": "node ./scripts/webpack --test",
                "build": "node ./scripts/webpack --build"
            });
        }
    }

    config.plugins.forEach( plugin=>{
        if( plugin==="es-vue" ){
            extend(true, packageinfo, webpackDeps);
            extend(true, packageinfo, javascriptDeps);
            if( config.vue_version ==="vue@2" ){
                packageinfo = extend(true, packageinfo, vue2Deps);
            }else{
                packageinfo = extend(true, packageinfo, vue3Deps);
            }
            pluginOptions[ plugin ]={
                version:config.vue_version ==="vue@2" ? '2.0.0' : '3.0.0',
                styleLoader:["style-loader","css-loader"],
            };
            updateScripts(plugin);
            fs.copySync( PATH.join(__dirname, "template/client"), PATH.join(config.project_path));
        }else if( plugin==="es-nuxt" ){
            packageinfo = extend(true, packageinfo, javascriptDeps);
            packageinfo = extend(true, packageinfo, vue3Deps);
            packageinfo = extend(true, packageinfo, nuxt);
            pluginOptions[ plugin ]={
                version:'3.0.0',
            };
            updateScripts(plugin);
            pluginOptions[plugin].pages=false;
            pluginOptions[plugin].projectConfigFile=false;
            fs.copySync( PATH.join(__dirname, "template/nuxt"), PATH.join(config.project_path));
        }else if( plugin==="es-uniapp" ){
            packageinfo = extend(true, packageinfo, javascriptDeps);
            packageinfo = extend(true, packageinfo, vue3Deps);
            packageinfo = extend(true, packageinfo, uniapp);
            pluginOptions[ plugin ]={
                version:'3.0.0',
            };
            updateScripts(plugin);
            fs.copySync( PATH.join(__dirname, "template/uniapp"), PATH.join(config.project_path));
        }else if( plugin==="es-thinkphp" ){
            extend(true, packageinfo, phpDeps);
            extend(true, packageinfo, thinkphpDeps);
            if(hasClient){
                pluginOptions[ plugin ]={
                    includes:[
                        'api/config/*',
                        'api/lang/*',
                        'api/console/*',
                        'api/middleware.es'
                    ],
                    resolve:{
                        folders:{
                            "*.global":"escore",
                            '*.route':'route',
                            'api/lang/***':'app/lang/{...}',
                            'api/console/***':'app/console/{...}',
                            'api/middleware/***':'app/middleware/{...}',
                            'api/http/***':'app/http/{...}',
                            'api/model/***':'app/model/{...}',
                            'api/config/***':'config/{...}',
                            'api/*.es':'app'
                        }
                    },
                    context:{
                        inherits:['es-php'],
                        include:[/([\\\/]|^)api([\\\/])/],
                        only:true
                    }
                };
                fs.copySync( PATH.join(__dirname, "template/api/src"), PATH.join(config.project_path,'src/api'));
            }else{
                pluginOptions[ plugin ]={
                    includes:[
                        'config/*',
                        'lang/*',
                        'middleware/*',
                        'console/*'
                    ],
                    resolve:{
                        folders:{
                            "*.global":"escore",
                            '*.route':'route',
                            'lang/***':'app/lang/{...}',
                            'console/***':'app/console/{...}',
                            'middleware/***':'app/middleware/{...}',
                            'http/***':'app/http/{...}',
                            'model/***':'app/model/{...}',
                            'config/***':'config/{...}',
                            'assets/***':'static',
                            'src/*.es':'app'
                        }
                    }
                };
                fs.copySync(PATH.join(__dirname, "template/server/src"), PATH.join(config.project_path,'src'));
            }
            pluginOptions[ plugin ]=Object.assign(pluginOptions[ plugin ], {
                devServer:{
                    path:getDescriptor(null, '运行路径，默认为output'),
                    host:getDescriptor(null, '运行地址，不指定为默认'),
                    port:getDescriptor(null, '运行端口，不指定为默认')
                }
            });
            updateScripts( plugin );

        }else if( plugin==="es-php" ){
            if( hasClient ){
                fs.copySync( PATH.join(__dirname, "template/api/Index.es"), PATH.join(config.project_path,'src/api','Index.es') );
            }else{
                fs.copySync( PATH.join(__dirname, "template/App.es"), PATH.join(config.project_path,'src','Index.es'));
            }
            extend(true, packageinfo, phpDeps);
            updateScripts( plugin );
        }else if( plugin==="es-javascript" ){
            fs.copySync( PATH.join(__dirname, "template/App.es"), PATH.join(config.project_path,'src','App.es'));
            extend(true, packageinfo, javascriptDeps);
            updateScripts( plugin );
        }
    });

    const hasNuxt = config.plugins.includes('es-nuxt');
    const hasVue = config.plugins.includes('es-vue');
    let needScripts = config.plugins.some( name=>{
        return ['es-nuxt', 'es-vue', 'es-thinkphp'].includes(name)
    })

    if(needScripts){

        extend(true, packageinfo, scriptsDeps);
        if(hasVue){
            fs.copySync(PATH.join(__dirname, "scripts", 'webpack'), PATH.join(config.project_path,'scripts','webpack') )
        }

        if( config.plugins.includes('es-thinkphp') ){
            fs.copySync( PATH.join(__dirname, "scripts", 'server.js'),  PATH.join(config.project_path,"scripts",'server.js') );
            fs.copySync( PATH.join(__dirname, "scripts", 'mysql.js'),  PATH.join(config.project_path,"scripts",'mysql.js') );
            fs.copySync( PATH.join(__dirname, "scripts", 'php.js'),  PATH.join(config.project_path,"scripts",'php.js') );
            packageinfo.devDependencies['shelljs'] = "^0.8.5";
            packageinfo.scripts['service:mysql'] = 'node scripts/mysql.js';
            packageinfo.scripts['service:php'] = 'node scripts/php.js';
            packageinfo.scripts['service:startup'] = 'npm run service:mysql & npm run service:php';
            createVSCodeTaskFile( config.project_path );
        }
    }

    const esConfig = {
        workspace:Utils.normalizePath( relativePath( PATH.join(config.project_path,"src"), config.project_path) ),
        plugins:config.plugins.map( plugin => {
            const options = pluginOptions[plugin]||{};
            return {
                'name':plugin,
                'plugin':`require("${plugin}")`,
                'options':options
            };
        })
    };

    if( hasNuxt || hasVue){
        esConfig.annotations=['Redirect','Metadata'];
    }

    if(config.plugins.length>1 && config.plugins.includes('es-thinkphp')){
        esConfig.metadata={
            http:{
                responseField:getDescriptor('data', '@Http请求响应的数据字段')
            }
        }
    }

    if(hasVue){
        fs.writeFileSync( PATH.join(config.project_path, "webpack.config.dev.js"), `module.exports = ` + stringify({
            entry:"App.es",
            output:relativePath(config.build_path, config.project_path),
            devServer:{
                open:true,
                hot:true,
                proxy: {
                    '/api': {
                        target: 'http://localhost:8000',
                        pathRewrite: { '^/api': '' },
                    },
                },
                static: {
                    publicPath: '/',
                }
            }
        }));
        fs.writeFileSync( PATH.join(config.project_path, "webpack.config.prod.js"), `module.exports = ` + stringify({
            entry:"App.es",
            output:relativePath(config.build_path, config.project_path)
        }));
    }

    fs.writeFileSync( PATH.join(config.project_path, "package.json"), stringify(packageinfo, 1, true));
    fs.writeFileSync( PATH.join(config.project_path, "es.config.js"), `module.exports = ` + stringify(esConfig));
    return [config, tasks];
}

function createVSCodeTaskFile(project_path){
    const dir = PATH.join(project_path,'.vscode')
    fs.mkdirSync(dir,{recursive:true});
    const content = {
        "version": "2.0.0",
        "tasks": [
            {
                "type": "npm",
                "script":"service:startup",
                "isBackground": true,
                "problemMatcher": [],
                "runOptions": {
                    "runOn": getDescriptor("default", ['default 手动运行','folderOpen 打开VSCode时自动运行'])
                },
                "label": "php+mysql Server",
                "presentation": {
                    "panel": "dedicated",
                    "reveal": "never"
                }
            }
        ]
    }
    fs.writeFileSync( PATH.join(dir, "tasks.json"), stringify(content, 1, true));
}

module.exports = create;