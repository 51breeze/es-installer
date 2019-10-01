const fs = require('fs');
const PATH = require('path');
const Utils = require('./bin/utils.js');
const extend =  require('extend');

const defaultConfig = {
    //需要编译文件的后缀
    'suffix': '.es', 
    //是否需要开启调式
    'debug':'enable', 
    //是否启用块级域
    'blockScope':'disabled',
    //指定编译器需要保护的关键字
    'reserved':[],
    //是否需要压缩
    'minify':'enable',
    //是否需要打包动画库
    'animate':true,
    //是否需要打包字体库
    'font':true,
    //指定主题文件名
    'theme':null,
    //需要使用的主题文件路径
    'theme_file_path':null,
    //是否需要输出编译后的原文件
    'source_file':"enable",
    //需要兼容浏览器的版本
    'compat_version':{ie:9},//要兼容的平台 {'ie':8,'chrome':32.5}
    //默认构建后输入的目录名
    'build_path':'./build',
    //默认的工程目录名
    'project_path':'./project',
    //工作根目录
    'workspace':'./src',
    //皮肤文件的后缀名
    'skin_file_suffix':'.html',
    //皮肤样式配置文件, 为每一个组件指定默认的皮肤类. 格式为 {"component.classname":"skin.path"}
    'skin_style_config':null,
    //工程文件的后缀，编译器只会编译指定这个后缀的文件
    'project_file_suffix':'.es',
    //是否支持浏览器
    'browser':'enable',
    //指定皮肤基类
    'baseSkinClass':'es.core.Skin',
    //指定一个生成构建代码目录的配置
    'config_file':null,
    //指定需要编译的文件名（文件目录），多个传递数组
    'bootstrap':null,
    //指定默认加载的应用页面，通常为 类的全名称比如：test.Index 默认为 index 应用名（如果存在）， 否则为第一个应用类
    'default_bootstrap_class':null,
    //需要引用外部库的名称 , [jQuery,...]
    'library':null,
    //是否启用严格类型， true 在每个声明的后面必须指定类型， false 可以不指定
    'strictType':true,
    //服务提供者的运行语法
    'service_provider_syntax':"php",
    //在静态文件后面指定path 来切换页面的参数名称
    'static_url_path_name':"PATH",
    //是否在构建目录的 webroot 里面运行
    'enable_webroot':false,
    //针对编译器的切换指令
    'command_switch':0,
     //是否把每个应用页分开加载
    'script_part_load':true,
     //系统库路径名
    'system_lib_path_name':'es',
    //系统全局类路径名
    'system_global_path':PATH.join(__dirname,"../javascript/system"),
     //系统库路径
    'system_lib_path':PATH.join(__dirname,"../"),
    //系统样式路径名
    'system_style_name':'style',
    //系统样式路径
    'system_style_path':PATH.join(__dirname,"../"),
    //主库目录名
    'build_libaray_name':"es",
     //生成系统类目录
    'build_system_path':"es.system",
    //需要重新生成工程的配置文件
    'clean':false,
    //1 标准模式（开发时使用） 2 性能模式（生产环境使用）
    'mode': 1, 
    //是否只构建application应用入口的文件 all app
    'build_mode':"all",
    //当编译出错时退出程序
    "on_error_exit":false,
    //监听当前工作空间中的文件变化
    "watching":false,
    //指定监听文件的后缀
    "watchMatchSuffix":null,
    //允许启动服务
    "serverEnable":true,
    //使用模块导出格式,仅js
    "module_exports":false,
    //加载模块时的后缀
    "module_suffix":'.js',
    //是否需要打包文件
    "build_pack":true,
    //启用热替换
    "hot_replacement":true,
};

//构建目录配置
const buildConfig = {
    "build": {
        "path": "",
        "name": "",
        "child": {
            "assets":{
                "path": "@webroot",
                "name": "assets",
            },
            "js": {
                "path": "@webroot",
                "name": "js",
            },
            "img": {
                "path": "@assets",
                "name": "./",
            },
            "css": {
                "path": "@webroot",
                "name": "css",
            },
            "font": {
                "path": "@assets",
                "name": "./",
            },
            "view": {
                "path": "@application",
                "name": "view",
            },
            "html":{
                "path":"@webroot",
                "name":"html",
            },
            "webroot":{
                "path":"./",
                "name":"webroot",
            },
            "system":{
                "path":"@js",
                "name":"system",
            },
            "core":{
                "path":"@js",
                "name":"./",
            },
            "bootstrap":{
                "path":"@application",
                "name":"bootstrap",
            },
            "application":{
                "path":"./",
                "name":"easescript",
            }
        },
    },
    //工作的主目录结构配置
    "project":{
        "path": "./",
        "name": "project",
        "child": {
            "src": {
                "path": "./",
                "name": "src",
            },
            "image":{
                "path": "@src",
                "name": "image",
            },
            "style":{
                "path": "@src",
                "name": "style",
            },
            "theme":{
                "path": "@src",
                "name": "theme",
            },
            "app":{
                "path": "@src",
                "name": "app",
            },
            "view":{
                "path": "@src",
                "name": "view",
            },
            "component":{
                "path": "@src",
                "name": "component",
            },
            "skin":{
                "path": "@src",
                "name": "skin",
            },
        },
    },
};

//安装包依赖
const package={
    "name": "Test",
    "version": "0.0.1",
    "description": "Test",
    "scripts": {
        "version": "node ./node_modules/easescript/bin/es.js -V",
        "dev": "node ./node_modules/easescript/bin/es.js {params} -M dev {-p} {-o} {-b} {-c} {--chunk} {--pack}",
        "test": "node ./node_modules/easescript/bin/es.js {params} -M test {-p} {-o} {-b} {-c} {--chunk} {--pack}",
        "build": "node ./node_modules/easescript/bin/es.js {params} -M production {-p} {-o} {-b} {-c} {--chunk} {--pack}"
    },
    "devDependencies":{
      "easescript":"1.1.23-beta",
      "libxmljs": "^0.18.6",
    }
}

const webpackDeps ={
    "dependencies": {
        "@babel/core": "^7.0.0",
        "babel": "^6.23.0",
        "babel-preset-es2015": "^6.24.1",
    },
    "devDependencies": {
        "less": "^2.7.3",
        "webpack": "^4.39.2",
        "webpack-cli": "^3.3.6",
        "webpack-dev-server": "^3.7.0",
        "style-loader": "^1.0.0",
        "url-loader": "^2.1.0",
        "css-loader": "^3.2.0",
        "babel-loader": "^8.0.6",
        "less-loader": "^5.0.0",
        "less-plugin-glob": "^3.0.0",
        "file-loader": "^4.2.0",
        "html-entities": "^1.2.1",
        "mini-css-extract-plugin": "^0.8.0",
        "source-map": "^0.7.3",
        "ansi-html": "0.0.7",
        "bindings": "^1.5.0",
        "events": "^3.0.0",
        "loglevel": "^1.6.3",
        "strip-ansi": "^5.2.0",
    }
};


/**
 * 构建工程结构
 * @param dir
 * @param base
 */
function buildProject(dir, base)
{
    var dirpath = base;
    if( dir.__build !== true )
    {
        var dirpath = PATH.isAbsolute(dir.path) ? PATH.resolve(dir.path, dir.name) : PATH.resolve(base, dir.path, dir.name);
        if (!fs.existsSync(dirpath)) {
            dirpath = Utils.mkdir(dirpath);
            if (typeof dir.bootstrap === "string" && dir.syntax) {
                //引用一个模板
                var file = PATH.resolve(config.root_path, dir.syntax, dir.bootstrap + dir.suffix);
                if (fs.existsSync( file )) {
                    fs.linkSync(file, PATH.resolve(dirpath, dir.bootstrap + dir.suffix));
                }
            }
        }
        dir.path = dirpath.replace(/\\/g, '/');
        dir.name = PATH.basename(dirpath);
        dir.__build = true;
    }

    if (dir.child)
    {
        for (var i in dir.child)
        {
            if( dir.child[i].path.charAt(0) === "@" )
            {
                var refName = dir.child[i].path.substr(1);
                if( !dir.child.hasOwnProperty( refName ) ){
                    throw new ReferenceError("Invalid reference path name for '"+refName+"'");
                }
                buildProject(dir.child[ refName ], dirpath);
                dir.child[i].path = dir.child[ refName ].path;
            }
            buildProject(dir.child[i], dirpath);
        }
    }
}

function configToJson( config , depth )
{
    var tab = new Array( depth+1 );
    tab = tab.join("\t");
    var type = config instanceof Array ? 'array' : typeof config;
    if( type ==="string" )return tab+config;
    var item = [];
    for( var p in config )
    {
        if( p ==="__build")continue;
        if( config[p]+""=="[object Object]" || config[p] instanceof Array )
        {
            item.push( tab+'"'+p+'":'+configToJson( config[p] , depth+1 ) );

        }else
        {
            var val = typeof config[p] === "string" ? config[p].replace(/\\/g, '/') : config[p];
            if (type === 'array') {
                item.push('"' + val + '"');
            } else if( typeof val ==="string" ) {
                item.push(tab + '"' + p + '":"'+val + '"');
            } else if(val !=null ) {
                item.push(tab + '"' + p + '":'+val);
            }
        }
    }

    tab = (new Array( depth )).join("\t");
    if( type ==='array' )
    {
        return '['+item.join(",")+']';
    }
    return '{\n'+item.join(",\n")+'\n'+tab+'}';
}

/**
 * 获取配置信息
 * @param config
 * @returns {*}
 */
function getConfigure(config)
{
     //合并默认属性
    config = extend(defaultConfig, config || {});

     //工程目录
    var project_path = config.project_path;
    if( !PATH.isAbsolute( project_path ) )
    {
        project_path = PATH.resolve( config.project_path );
        if( !fs.existsSync(project_path) )
        {
            fs.mkdirSync( project_path );
        }
    }

     //默认配置文件
    var makefile = PATH.resolve(project_path,'.esconfig');
    //easescript 路径
    var root_path = PATH.join(project_path,"node_modules/easescript");

    config.system_lib_path=root_path;
    config.system_style_path=root_path;

    //编译器的路径
    config.root_path = root_path;

    //合并默认配置文件
    if( config.config_file )
    {
        extend(config, require( config.config_file ) );
    }else {
        extend(config, buildConfig);
    }

    //当前工程项目路径
    config.project_path = project_path;
    config.project.path = project_path;
    config.project.name = PATH.basename(project_path);
    config.project.__build=true;
    buildProject(config.project,project_path);

    //构建输出目录
    buildProject(config.build, config.project_path );
    config.build_path = config.build.path;

    //工作空间目录
    if( config.workspace )
    {
        if( !PATH.isAbsolute(config.workspace) )
        {
            config.workspace = PATH.join(project_path, config.workspace);
        }
        if( !fs.existsSync( config.workspace ) )
        {
            Utils.mkdir( config.workspace );
        }

    }else
    {
        config.workspace = config.project.child.src.path;
    }

    //主题配置文件路径
    if( config.theme_file_path && !PATH.isAbsolute( config.theme_file_path ) )
    {
        config.theme_file_path = PATH.resolve( config.project_path, config.theme_file_path );
    }

    //指定组件皮肤样式配置文件
    if( config.skin_style_config )
    {
        var dataitem={};
        Utils.forEach(config.skin_style_config, function (item,key) {
            if( item.slice(-5)===".conf" )
            {
                if( !PATH.isAbsolute( item ) )
                {
                    item = PATH.resolve(config.project_path, item);
                }
                if( !fs.existsSync( item ) )
                {
                    throw new ReferenceError( item+" is not exists.");
                }
                var fileconfig = JSON.parse( fs.readFileSync(item) );
                if( fileconfig ){
                    dataitem = extend(true,dataitem,fileconfig);
                }
            }else{
                dataitem[key]=item;
            }
        });
        config.skin_style_config = dataitem;
    }

    //系统类库路径名
    //在加载类文件时发现是此路径名打头的都转到系统库路径中查找文件。
    config.system_core_class={
        "iteratorClass":"es.interfaces.IListIterator",
    };

    //系统必需要加载的类
    var system_main_class = [];
    for( var scc in config.system_core_class )
    {
        system_main_class.push( config.system_core_class[scc] );
    }
    config.system_require_main_class = system_main_class;

    //构建应用的目录名
    config.build_application_name = Utils.getBuildPath(config,"build.application","name");

    //生成一个默认的配置文件
    fs.writeFileSync(makefile, configToJson( config , 1 ) );
    return config;
}


//创建工程配置
function create(config)
{
    const cmd = {
          "-p":"project_path",
          "-o":"build_path",
          "-c":"config_path",
          "-b":"bootstrap",
    }

    config = getConfigure( config );

    ['dev','test','build'].forEach( name=>{
        package.scripts[ name ] = package.scripts[ name ].replace(/\{([\w\-]+)\}/g, function(a,b){
            switch( b )
            {
                case "--chunk" :
                    return config.chunk ? "--chunk" : '';
                case "--pack" :
                    return config.use_webpack ? '' : '--pack';
                case "params" :
                    return config.params || '';
                case "-b" :
                    return config.bootstrap === "[project_src_dir]" ?  "" :  "-b "+config.bootstrap;
                default :
                     return  config[ cmd[b] ] && `${b} ${config[ cmd[b] ]}` || '';
            }
        });
    });

    if( config.libxmljs_local_path )
    {
        const libxmljs_local_path = PATH.isAbsolute( config.libxmljs_local_path ) ? config.libxmljs_local_path : PATH.resolve( process.cwd(), config.libxmljs_local_path);
        package.devDependencies.libxmljs="file:"+libxmljs_local_path;
    }

    var packageinfo = extend({},package);
    packageinfo.name = config.project.name;

    if( config.description )
    {
        packageinfo.description = config.description;
    }

    if( config.author )
    {
        packageinfo.author = config.author;
    }

    if( config.supportSkin === false )
    {
       delete packageinfo.devDependencies.libxmljs;
    }

    if( config.use_webpack )
    {
        packageinfo = extend(true,packageinfo,webpackDeps);
    }

    //config
    fs.writeFileSync( PATH.join(config.project_path, "package.json"), configToJson( packageinfo , 1 ) );
    Utils.info('Project create done, path:'+config.project.path+".");
    if( !config.auto_installer )
    {
        Utils.info("step next please use cmd 'npm install'." );
    }
    Utils.copyfile( PATH.join(__dirname, "./Welcome.es"), PATH.join(config.project.child.src.path,"Welcome.es") );
    return config;
}

module.exports = create;