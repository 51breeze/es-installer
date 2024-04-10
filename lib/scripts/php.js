const services = require('./server');
const {project_config} = require('./config');
const plugins = project_config.plugins||[]
const plugin = plugins.find(plugin=>plugin.name==='es-thinkphp')
if(plugin){
    let startupPath = item.options.startupPath || item.options.output;
    if( !path.isAbsolute(startupPath) ){
        startupPath = path.join(process.cwd(), startupPath);
    }
    services.thinkphp(startupPath).then( data=>{
        if( data.result ){
            console.info( `\r\nPHP starting successful!` )
        }else{
            console.info(data.error)
        }
    }).catch(err=>{
        console.error(err)
    })
}



