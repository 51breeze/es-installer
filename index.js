const fs = require('fs');
const PATH = require('path');
const Utils = require('./utils.js');
const extend =  require('extend');
const root = __dirname;

//安装包依赖
const package={
    "name": "Test",
    "version": "0.0.1",
    "description": "Test",
    "scripts": {
        "version": "node ./node_modules/easescript/bin/es.js -V",
        "init": "node ./node_modules/easescript/bin/es.js --init -m production {-p} {-o} {-b} {-c} {--sps} {--chunk} {--pack} {--other}",
        "start": "node {--start}",
        "build": "node {--build}"
    },
    "devDependencies":{
      "easescript":"^1.2.0",
      "libxmljs": "^0.18.6",
      "less": "^3.10.3",
    }
}

const webpackDeps ={
    "dependencies": {
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
        "optimize-css-assets-webpack-plugin": "^5.0.0",
        "html-webpack-plugin": "^3.2.0",  
        "source-map": "^0.7.3",
        "ansi-html": "0.0.7",
        "bindings": "^1.5.0",
        "events": "^3.0.0",
        "loglevel": "^1.6.3",
        "strip-ansi": "^5.2.0",
    }
};

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

const cmd = {
    "-p":"project_path",
    "-o":"build_path",
    "-c":"config_path",
    "-b":"bootstrap",
    "--sps":"service_provider_syntax"
}

const types = ['init','build','start'];

function replaceOption(config, content )
{
    return content.toString().replace(/\/\*\[(\w+)\]\*\//g,function(a,b){
        switch( b )
        {
            case "INSTALL_OPTIONS":
                const options = {
                    chunk:config.chunk,
                    config:config.config_path,
                    project:config.project_path.replace(/\\/g,'/'),
                    build:config.build_path.replace(/\\/g,'/'),
                    server_render:config.server_render
                };
                return `const INSTALL_OPTIONS=${JSON.stringify(options)};`;
            case "INSTALL_WELCOME_PATH":
                return `const INSTALL_WELCOME_PATH="${PATH.resolve(root,"./Welcome.es").replace(/\\/g,'/')}";`;
            case "SERVER_HOST":
                return `const SERVER_HOST = "${config.host}";`;
            case "SERVER_PORT": 
                return `const SERVER_PORT = ${config.port||80};`;
        }
        return "";
    });
}

//创建工程配置
function create(config)
{
    //工程目录
    var project_path = config.project_path;
    if( !PATH.isAbsolute( project_path ) )
    {
        project_path = PATH.resolve(process.cwd(), config.project_path );
        if( !fs.existsSync(project_path) )
        {
            Utils.mkdir( project_path );
        }
        config.project_path = project_path;
    }

    if( config.build_path )
    {
        if( !PATH.isAbsolute( config.build_path ) )
        {
           config.build_path = PATH.resolve(process.cwd(), config.build_path ); 
        }

        if( !fs.existsSync(config.build_path) )
        {
            Utils.mkdir( config.build_path );
        }
    }

    if( config.other )
    {
        config.other = config.other.replace(/\-[p|o|c|b|M]\s+([^\s]*)/g,'').replace(/\-\-(chunk|pack)(\s+|$)/g,'');
    }

    types.forEach( name=>{

        package.scripts[ name ] = package.scripts[ name ].replace(/\{([\w\-]+)\}/g, function(a,b){
            
            switch( b )
            {
                case "--chunk" :
                    return config.chunk ? "--chunk" : '';
                case "--pack" :
                    return config.use_webpack ? '' : '--pack';
                case "-b" :
                    return config.bootstrap === "[project_src_dir]" ?  "" :  "-b "+config.bootstrap;
                case "--other" :
                    return config.other || '';
                case "--start" :
                    return PATH.join(config.project_path,"bin","start.js");
                case "--build" :
                    return PATH.join(config.project_path,"bin","build.js");
                default :
                    return  config[ cmd[b] ] && `${b} ${config[ cmd[b] ]}` || '';
            }
        }).replace(/\s+/g," ").replace(/\s+$/g,"");
    });

    if( config.libxmljs_local_path )
    {
        const libxmljs_local_path = PATH.isAbsolute( config.libxmljs_local_path ) ? config.libxmljs_local_path : PATH.resolve( process.cwd(), config.libxmljs_local_path);
        package.devDependencies.libxmljs="file:"+libxmljs_local_path;

    }else if( config.skin === false )
    {
       delete package.devDependencies.libxmljs;
    }
  
    var packageinfo = extend({},package);
    packageinfo.name = PATH.basename(config.project_path);

    if( config.description )
    {
        packageinfo.description = config.description;
    }

    if( config.author )
    {
        packageinfo.author = config.author;
    }

    const bin = PATH.join(config.project_path,"bin");
    if( !fs.existsSync(bin) )
    {
        Utils.mkdir( bin );
    }

    if( config.use_webpack )
    {
        fs.writeFileSync( PATH.join(bin,"start.js"),  replaceOption(config, fs.readFileSync( PATH.resolve(root,"./config/webpack/dev.js") ) ) )
        fs.writeFileSync( PATH.join(bin,"build.js"),  replaceOption(config, fs.readFileSync( PATH.resolve(root,"./config/webpack/production.js") ) ) )
        fs.writeFileSync( PATH.join(config.project_path,"config.js"), replaceOption(config, fs.readFileSync( PATH.resolve(root,"./config.js") ) ) )

        Utils.copyfile( PATH.resolve(root,"./config/webpack/bootstrap.js"), PATH.join(bin,"bootstrap.js") );
        Utils.copyfile( PATH.resolve(root,"./index.html"), PATH.join(config.project_path,"index.html") );
       
        packageinfo = extend(true,packageinfo,webpackDeps);

    }else
    {
        fs.writeFileSync( PATH.join(bin,"start.js"),  replaceOption(config, fs.readFileSync( PATH.resolve(root,"./config/dev.js") ) ) )
        fs.writeFileSync( PATH.join(bin,"build.js"),  replaceOption(config, fs.readFileSync( PATH.resolve(root,"./config/production.js") ) ) )
    }

    Utils.copyfile( PATH.resolve(root,"./task.js"), PATH.join(bin,"task.js") );

    //config
    fs.writeFileSync( PATH.join(config.project_path, "package.json"), configToJson( packageinfo , 1 ) );
    Utils.info('Project create done, path:'+config.project_path+".");
    if( !config.installer )
    {
        Utils.info("Step next please use cmd 'npm install'. in project path." );
    }

    return config;
}

module.exports = create;