const fs = require("fs");
const path = require('path');
const watch = require("easescript/lib/watch");

/**
 * 数据库驱动
 * 目前权支持mysql, 如果需要可以自己实现
 */
const drives={
    mysql( config ){
        const Mysql= require("mysql");
        const connection = Mysql.createConnection({
            host     :config.host     || '127.0.0.1',
            port     :config.port     || '3306',
            user     :config.user     || 'root',
            password :config.password || '',
            database :config.dbname
        });
        connection.connect();
        process.on('SIGINT', () => {
            connection.end();
        });

        return ( sql, params, callback )=>{
            connection.query(sql, function (err, rows, fields) {
                if (err) throw err;
                callback( rows, fields);
            });
        }
    }
}

function serviceProvider(boot, config, name )
{
    const factor = drives[ config.driver.toLowerCase() ];
    const provider = factor ? factor( config ) : null;
    if( provider )
    {
        boot.serviceProvider(name, (cmd, params, callback)=>{
            provider(cmd, params, callback);
        });

    }else
    {
        throw new TypeError( dbconfig.driver.toLowerCase()+" driver is not supported.");
    }
}

function clean( dir , level )
{
   if( fs.existsSync(dir) && fs.statSync( dir ).isDirectory() )
   {
      fs.readdirSync(dir).forEach( (file)=>{
          file = path.join(dir, file );
          const stat = fs.statSync(file);
          if( stat.isDirectory() )
          {
              clean( file, level+1 );
              if( level > 1 ){
                  fs.rmdirSync( file );
              }
              
          }else{
              fs.unlinkSync( file );
          }
      });
  }
}

module.exports={
    before:( project_config )=>{
        clean( project_config.build.path, 0 );
    },
    after:(  project_config, compiler, stats )=>{
        //todo zip files
    },
    runServer(app, project_config, compiler, stats)
    {
        if( project_config.service_provider_syntax !== "node" )
        {
            return;
        }
        
        const index  = path.join(project_config.build.child.bootstrap.path,"index.js");
        if( fs.existsSync(index)  )
        {
            const start = ()=>{

                //开发环境直接使用 webpack 的服务， 可以接入到生产环境的应用
                const Bootstrap = require( index );
                const boot = new Bootstrap( app );
                const appConfig = boot.getConfig();

                //如果需要使用数据服务，则需要先注册
                if( appConfig )
                {
                    //todo more config..
                    ["database","redis"].forEach( (name)=>{

                        var config = Array.isArray( appConfig[name] ) ? appConfig[name][0] : appConfig[name];
                        if(config)
                        {
                            serviceProvider( boot, config, name);
                        }
                    });
                }

                //注册路由服务
                boot.start( (method,route,callback)=>{
                    app[method](route,callback);
                });

                //在没有匹配到服务的情况下，始终输出index.html内容
                app.use(function(req, res, next){
                    var content = stats.compilation.assets[ "index.html" ] ? stats.compilation.assets[ "index.html" ].source() : null;
                    res.status( content ? 200 : 404 );
                    res.send( content || ("Not found "+req.path) );
                });
            }

            //开发环境下用于监听文件变动后重新加载文件
            watch.start({files:project_config.build.child.application.path, match:/\.(js|json)/i },(filename, stats )=>{

                if( stats )
                {
                    delete require.cache[ require.resolve( filename ) ];
                    start();

                }else
                {
                    console.log(`"${filename}" deleted.` );
                }

            });

            start();
        }

    }
}