const webpack = require("webpack");
const chalk = require('chalk');
const fs = require("fs-extra");
const path = require("path");
const {webpack_config, project_config} = require('./config');
webpack_config.mode = "production";
webpack_config.devtool = false;
const compiler = webpack( webpack_config );
if( webpack_config.output.path ){
    const readdir = (paths)=>{
        return paths.map( _path=>{
            if( fs.existsSync(_path) && fs.statSync(_path).isDirectory() ){
                return fs.readdirSync(_path).filter(name=>{
                    if(name==='.'||name==='..')return false;
                    return fs.statSync(path.join(_path,name)).isDirectory();
                }).map( name=>path.join(_path,name) );
            }
            return [];
        }).flat();
    }

    const isSubApp=(rootPath)=>{
        rootPath = path.dirname(rootPath);
        if( path.basename(rootPath) === 'app' ){
            rootPath = path.dirname(rootPath);
            return ['composer.json','think','.env','vendor','public','runtime'].some( name=>{
                return fs.existsSync(path.join(rootPath,name));
            });
        }
        return false;
    }

    const outputs = project_config.plugins.map( plugin=>{
        let rootPath = plugin.options && plugin.options.output ? path.resolve(plugin.options.output) : null;
        if(!rootPath)return [];
        if(plugin.name==='es-thinkphp' && !isSubApp(rootPath) ){
            const excludes = ['public','runtime','vendor','extend','app'].map( name=>path.join(rootPath,name) );
            return readdir([
                rootPath,
                path.join(rootPath,'app')
            ]).filter( name=>{
                return !excludes.includes(name);
            });
        }
        return [rootPath];
    }).flat();

    Promise.allSettled(outputs.map(pathName=>fs.emptyDir(pathName))).then( ()=>{
        compiler.run(function(error,stats){
            if( !error ){
                if( stats.hasErrors() ){
                    console.info( stats.toString({colors:true}) )
                    console.info( chalk.bgRed( `\r\nBuild failed.` ) );
                }else {
                    if( stats.hasWarnings() ){
                        console.info( stats.toString({colors:true}) )
                    }
                    console.info( chalk.green( `\r\nBuild done. \r\nOutput path: ${webpack_config.output.path}\r\n` ) );
                }
            }else{
                console.info( chalk.bgRed(error.message) );
            }
        })
    });

}else{
    console.info( chalk.bgRed('Output path is empty') );
}