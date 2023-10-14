if( process.argv.includes( '--build' ) ){
    process.env.NODE_ENV="production";
    require('./build');
}else if( process.argv.includes( '--dev' ) ){
    process.env.NODE_ENV="development";
    require('./dev');
}else{
    console.error('Invalid argument');
}