const services = require('./server');
services.mysql().then( data=>{
    if( data.result ){
        console.info( `\r\nMysql startup successful!` )
    }else{
        console.error( data.error )
    }
}).catch(err=>{
    console.error( err )
})