const fs = require('fs');
const PATH = require('path');
const Utils = require('./bin/utils.js');
const extend =  require('extend');

//需要保护的关键字
const reserved=['let', 'of','System',"Context"];

//编译器的上下文对象
const compileContext={
    "public":"_public",
    "protected":"_protected",
    "private":"_private",
    "internal":"_internal",
    "defineModuleMethod":"define",
    "package":"Context",
};

//全局配置
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
    'theme':"default",
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
};

//构建目录配置
const buildConfig = {
    "build": {
        "path": "./",
        "name": "build",
        "child": {
            "js": {
                "path": "@webroot",
                "name": "js",
            },
            "img": {
                "path": "@webroot",
                "name": "img",
            },
            "css": {
                "path": "@webroot",
                "name": "css",
            },
            "font": {
                "path": "@webroot",
                "name": "fonts",
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
    "version": "0.0.0",
    "description": "Test",
    "devDependencies":{
      "uglify-js": "^3.1.1",
      "commander": "^2.11.0",
      "easescript":"^1.0.0",
      "less": "^2.7.2",
      "colors": "^1.1.2",
      "libxmljs": "^0.18.6"
    }
}


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
    var tab = new Array( depth );
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
            } else {
                item.push(tab + '"' + p + '":"'+val + '"');
            }
        }
    }

    tab = new Array( depth-1 );
    tab = tab.join("\t");
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
    var root_path = PATH.join(__dirname,"../");

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
                var fileconfig = JSON.parse( Utils.getContents(item) );
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
    Utils.setContents(makefile, configToJson( config , 1 ) );
    return config;
}


//创建工程配置
function create(config)
{
    config.clean = true;
    config = getConfigure( config );
    var packageinfo = extend({},package);
    packageinfo.name = config.project.name;

    if( config.author )
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

    Utils.setContents( PATH.join(config.project_path, "package.json"), configToJson( package , 1 ) );
    Utils.info('Project create done, path:'+config.project.path+".");
    if( !config.auto_installer )
    {
        Utils.info("step next please use cmd 'npm install'." );
    }
    return config;
}

module.exports = create;