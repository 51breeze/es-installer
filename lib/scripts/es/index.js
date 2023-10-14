const Compiler = require('easescript/lib/core/Compiler.js');
const path = require("path");
const fs = require("fs");
const cwd = path.join(__dirname, '../../');
const config_path = path.join( cwd , 'es.config.js' );
const bootstrap = path.join( cwd, 'src', 'App.es' );
const project_config = config_path && fs.existsSync(config_path) ? require( config_path ) : {
    chunk:true,
    bootstrap,
    workspace:path.join( cwd, 'src'),
    output:path.join( cwd, 'build')
};

const option = Object.assign({
    bootstrap,
    env:{}
},project_config);

if( !path.isAbsolute( option.bootstrap ) ){
    option.bootstrap = path.resolve(project_config.workspace,  option.bootstrap);
}

option.file = option.bootstrap;
option.configFileName = null;
option.plugins = (option.plugins || []).map( plugin=>{
    return {
        plugin:plugin.plugin, 
        options:Object.assign(plugin.options||{}, {
            emitFile:true, 
            webpack:false
        })
    }
});

if( process.argv.includes( '--build' ) ){
    option.env.mode = 'production';
    Compiler.start(option);
}else if( process.argv.includes( '--dev' ) ){
    option.env.mode = 'dev';
    Compiler.start(option);
}else{
    console.error('Invalid argument');
}