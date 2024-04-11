const services = require('./server');
const path = require('path');
const config = require(path.join(__dirname,'..','es.config.js'));
const plugins = config.plugins||[]
const plugin = plugins.find(plugin=>plugin.name==='es-thinkphp')
if(plugin){
    let runPath = plugin.options.output;
    let devServer = plugin.options.devServer || {}
    services.thinkphp(devServer.path || runPath, devServer.port||null, devServer.host||null).then( data=>{
        if( data.result ){
            console.info( `\nPHP starting successful!` )
        }else{
            console.info(data.error)
            console.info( `\nPHP startup failed!` )
        }
    }).catch(err=>{
        console.error(err)
    })
}else{
    console.error('Not found php plugins')
}