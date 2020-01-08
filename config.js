var config  = {};
/*[SERVER_HOST]*/
/*[SERVER_PORT]*/
if( process.env.NODE_ENV==="development" )
{
    config={
        host:SERVER_HOST,
        port:SERVER_PORT,
        database:[
            /*{
                driver:"mysql",
                host:"127.0.0.1",
                port:3306,
                user:"root",
                password:"",
                dbname:"test",
                master:true
            }*/
        ],
        redis:[],
        proxy:{}
    }

}else
{
    //production
    config={
        host:SERVER_HOST,
        port:SERVER_PORT,
        database:[],
        redis:[],
        proxy:{}
    }
}
module.exports=config;