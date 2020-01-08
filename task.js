const fs = require("fs");
const path = require('path');
const watch = require("easescript/lib/watch");
const chokidar = require('chokidar');

/**
 * 数据库驱动
 * 目前权支持mysql, 如果需要可以自己实现
 */
const drives={
    mysql( config ){
        const mysql= require("mysql");
        const pool = mysql.createPool({
            host     :config.host     || '127.0.0.1',
            port     :config.port     || '3306',
            user     :config.user     || 'root',
            password :config.password || '',
            database :config.dbname
        });
        return ( sql, params, callback )=>{
            pool.getConnection(function(error, connection)
            {
                if( error )
                {
                    callback( null , error);

                }else
                {
                    connection.query(sql,params||[],function (error, rows) {
                        connection.release();
                        callback( rows , error);
                    });
                }

            });
        };
    }
}

function serviceProvider(boot, config, name )
{
    const factor = drives[ config.driver.toLowerCase() ];
    const provider = factor ? factor( config ) : null;
    if( provider )
    {
        boot.pipe(name, (cmd, params, callback)=>{
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

        var public  = project_config.build.child.webroot.path;
        if( fs.existsSync(public) && fs.statSync(public).isDirectory() )
        {
            fs.readdirSync( public ).forEach( (name)=>{
                if( !(name==="." || name==="..") )
                {
                    var pathname = path.join(public,name);
                    if( fs.statSync( pathname ).isDirectory() )
                    {
                        clean(pathname, 0 );
                    }
                }
            });
        }
    },
    after:(  project_config, compiler, stats )=>{
        //todo zip files
    },
    runServer(app, project_config)
    {
        const index  = path.join(project_config.build.child.bootstrap.path,"index.js");
        if( project_config.service_provider_syntax !== "node" || !fs.existsSync(index) )
        {
            return;
        }
        
        const bindRouteMap = {};
        const start = ()=>{

            //开发环境直接使用 webpack 的服务， 可以接入到生产环境的应用
            const Bootstrap = require( index );
            const boot      = new Bootstrap( app );
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
            boot.bindRoute( (method,route,callback)=>{
                if( !bindRouteMap[ route ] )
                {
                    bindRouteMap[ route ] = true;
                    app[method](route,callback);
                }
            });
        }

        //清除已加载的模块文件
        const clearFileCache=( pathname )=>{

            if( fs.statSync(pathname).isDirectory() )
            {
                fs.readdirSync( pathname ).forEach( (filename)=>{
                    if( !(filename==="." || filename==="..") )
                    {
                        clearFileCache( path.join(pathname,filename) );
                    }
                });

            }else
            {
                const file = require.resolve( pathname );
                delete require.cache[ file ];
            }
        }

        //服务端根目录
        const rootpath = project_config.build.child.application.path;
        const watch = chokidar.watch(rootpath, {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });

        process.on("exit", ()=>{
            watch.close();
        });
        
        process.on('SIGINT', () => {
            watch.close();
        });

        //开发环境下用于监听文件变动后重新加载文件
        watch.on("change",(filename)=>{
            if( /\.(js|json)$/i.test( filename ) )
            {
                clearFileCache( rootpath );
                start();
            }
        });

        start();
    }
}