const services = require('./server');
const {project_config} = require('./config');
const plugins = project_config.plugins||[]
const plugin = plugins.find(plugin=>plugin.name==='es-thinkphp')
if(plugin){
    let devServer = plugin.options.devServer || {
        path:plugin.options.output,
        port:null,
        host:null
    }
    services.thinkphp(devServer.path, devServer.port, devServer.host).then( data=>{
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