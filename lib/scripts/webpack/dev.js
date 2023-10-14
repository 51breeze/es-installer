const path =  require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const webpackDevServer = require('webpack-dev-server');
const {webpack_config,project_config} = require('./config');
const services = require('../server');
const devServer = Object.assign({
    host:'localhost',
    port:'8088',
    open:true,
    hot:true,
    static: {
        publicPath: '/',
    }
}, project_config.devServer);
webpack_config.devServer = devServer;
webpack_config.mode = 'development';
const compiler = webpack(webpack_config);
const server = new webpackDevServer(devServer, compiler);
const runServer = async ()=>{
    await server.start();
};

const tasks = [];
(project_config.plugins||[]).forEach( async (item)=>{
    if( item.plugin ==='es-thinkphp' ){
        let runtimePath = item.options.output;
        if( !path.isAbsolute(runtimePath) ){
            runtimePath = path.join(process.cwd(), runtimePath);
        }
        tasks.push(new Promise( async (resolve)=>{
            const result = await services.mysql();
            if( result.result ){
                console.info( chalk.bgGreen( `\r\nMysql starting successful!` ) )
            }else{
                console.info( chalk.bgRedBright( String(result.error) ) )
            }
            const result2 = await services.thinkphp(runtimePath);
            if( result2.result ){
                console.info( chalk.bgGreen( `\r\nPHP starting successful!` ) )
            }else{
                console.info( chalk.bgRedBright( String(result2.error) ) )
            }
            resolve(true);
        }));
    }
});

if( tasks.length > 0 ){
    Promise.all(tasks).then( ()=>{
        runServer();
    })
}else{
    runServer();
}