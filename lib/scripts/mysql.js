const services = require('./server');
services.mysql().then( data=>{
    if( data.result ){
        console.info( `\nMysql startup successful!` )
    }else{
        console.error( data.error )
        console.info( `\nMysql startup failed!` )
    }
}).catch(err=>{
    console.error( err )
})