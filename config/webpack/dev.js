process.env.NODE_ENV="development";
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const easescript_root = path.dirname( path.dirname(require.resolve("easescript") ) );
const es = require("easescript");
const builder = require("easescript/javascript/builder");
const watch = require("easescript/lib/watch");
const webpackDevServer = require('webpack-dev-server');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {spawn} = require('child_process');
const Task = require('./task.js');
const chokidar = require('chokidar');
/*[INSTALL_OPTIONS]*/
/*[INSTALL_WELCOME_PATH]*/

function findConfigPath( dir )
{
  while( fs.lstatSync( dir ).isDirectory() && path.parse(dir).name )
  {
      var file = path.resolve( dir,'.esconfig');
      if( fs.existsSync( file ) )
      {
          return file;
      }
      dir = path.dirname( dir );
  }
  return null;
}

var default_bootstrap_class = null;
function createBootstrap( config, modules )
{
  var bootstrap_class = default_bootstrap_class;
  if( !bootstrap_class )
  {
      bootstrap_class = config.default_bootstrap_class || modules.filter( item=>{
          return item.classname.toLowerCase() === "index";
      }).map( item=>item.fullclassname )[0];

      if( !bootstrap_class )
      {
         bootstrap_class = (modules.filter( module=> module.defineMetaTypeList && module.defineMetaTypeList.Router )[0] || modules[0]).fullclassname;
      }
      default_bootstrap_class = bootstrap_class;
  }

  var router = builder.routerListToJsonString( es.compile.getServiceRoutes( modules ) );
  const bootstrapModule = modules.filter( module=> module.fullclassname === bootstrap_class )[0];
  const defaultRoute = bootstrapModule.defineMetaTypeList && bootstrapModule.defineMetaTypeList.Router ? 
                  bootstrapModule.defineMetaTypeList.Router.param.provider : bootstrapModule.fullclassname+"@";
                  
  const hasApp = !!bootstrapModule.isApplication;
  const data = {
    "HTTP_DEFAULT_ROUTE":defaultRoute,
    "HTTP_ROUTES":router||"{}",
    "HTTP_ROUTE_PATH":null,
    "MODE":config.mode,
    "ORIGIN_SYNTAX":config.originMakeSyntax,
    "URL_PATH_NAME":config.static_url_path_name||"PATH",
    "HTTP_ROUTE_CONTROLLER":null,
    "COMMAND_SWITCH":config.command_switch,
    "WORKSPACE":path.relative( config.project.path, config.workspace).replace(/\\/g,"/"),
    "PROJECT_PATH":config.project.path,
    "MODULE_SUFFIX":config.suffix,
    "HOT_UPDATA":`function(){}`
  };

  if( config.hot_replacement)
  {
    data.HOT_UPDATA=`(function(){
        var hotUpdateMap = {};
        var hotUpdateEvent = function(e){
              var module = e.hotUpdateModule;
              var updateClass = System.getQualifiedClassName(module);
              if( hotUpdateMap[updateClass] )
              {
                  var items = hotUpdateMap[updateClass].splice(0);
                  while( items.length > 0 )
                  {
                      var item = items.shift();
                      var callback = item[2];
                      if( !callback.call(item, item[1], module) )
                      {
                         hotUpdateMap[updateClass].push( item );
                      }else{
                         e.preventDefault();
                      }
                  }
              }
        };

        if( !System.getGlobalEvent().hasEventListener("DEVELOPMENT_HOT_UPDATE") )
        {
            System.getGlobalEvent().addEventListener("DEVELOPMENT_HOT_UPDATE",hotUpdateEvent);
        }

        return function hotUpdate( target, callback )
        {
            var name = System.getQualifiedObjectName(target);
            var list = hotUpdateMap[ name ] || (hotUpdateMap[ name ] = []);
            list.push([name,target,callback]);
        };

    }())`;
  }

  var content = fs.readFileSync( path.join(__dirname,"bootstrap.js") ).toString();
  data["LAZY_LOAD_MAP"] = "{}";
  if( INSTALL_OPTIONS.chunk )
  {
    data["LAZY_LOAD_MAP"] = "{"+modules.map( module=>{
      return `"${module.fullclassname}": function( callback ){
                import(/*webpackChunkName:"${module.fullclassname.replace(/\./g,'-')}"*/ "${module.filename}" ).then(function(module){
                    callback(module.default || module);
                });
          }`;
    }).join(",")+"}";

  }

  content = content.replace(/\[CODE\[(.*?)\]\]/ig, function (a, b) {
      return data[b] !== undefined ? data[b] : "";
  })

  if( !INSTALL_OPTIONS.chunk )
  {
     content=`import ${bootstrapModule.classname} from "${bootstrapModule.filename}";\n`+content;
  }

  if( hasApp )
  {
     content=`import "@style/less/main.less";\n`+content;
  }

   const file = path.join(config.project.path,"bootstrap.js");
   fs.writeFileSync( file, content );
   return file;
}

var initConfig = false;
var hasInitConfig = false;

/**
 * 开始构建服务
 */
function start()
{
  var config_path = findConfigPath( process.cwd() );
  if( !config_path && !initConfig )
  {
    initConfig = true;
    hasInitConfig = true;
    spawn(process.platform === "win32" ? "npm.cmd" : "npm" , ['run','init'], {cwd:process.cwd(),stdio: 'inherit'}).on("close",start);
    return;
  }

  if( !fs.existsSync(config_path) )
  {
     throw new Error("Not found project config file.");
  }

  const project_config =  es.createConfigure( JSON.parse( fs.readFileSync( config_path ) ) );
  const lessOptions = {
    globalVars:builder.getLessVariables( project_config ),
    paths:[
        path.resolve(easescript_root,'style'),
    ]
  };

  project_config.hot_replacement = true;
  project_config.env_name = "development";

  if( hasInitConfig )
  {
    hasInitConfig = false;
    if( typeof fs.copyFileSync === "function" ){
        fs.copyFileSync( INSTALL_WELCOME_PATH, path.join(project_config.project.child.src.path,"Welcome.es") );
        fs.copyFileSync( path.join( path.dirname(INSTALL_WELCOME_PATH), "WelcomeView.html" ) , path.join(project_config.project.child.src.path,"WelcomeView.html") );
    }else{
        fs.createReadStream(INSTALL_WELCOME_PATH).pipe( fs.createWriteStream( path.join(project_config.project.child.src.path,"Welcome.es") ) );
        fs.createReadStream(  path.join( path.dirname(INSTALL_WELCOME_PATH), "WelcomeView.html" )  ).pipe( fs.createWriteStream( path.join(project_config.project.child.src.path,"WelcomeView.html") ) );
    } 
  }

  if( INSTALL_OPTIONS.server_render && project_config.service_provider_syntax ==="node" )
  {
     project_config.only_current_syntax = true;
     project_config.server_render       = true;
  }

  Task.before( project_config );

  const bootstrap = es.getBootstrap( project_config );
  const entryMap = {
    "index":createBootstrap(project_config, bootstrap )
  };
  const app_config_file = path.join(project_config.project.path, "config.js");
  const webroot_path = project_config.build.child.webroot.path;
  const js_path = path.relative( webroot_path, project_config.build.child.js.path  );
  const font_path = path.relative( webroot_path, project_config.build.child.font.path  );
  const img_path = path.relative( webroot_path, project_config.build.child.img.path  );
  const css_path = path.relative( webroot_path, project_config.build.child.css.path  );
  var runConfig = fs.existsSync(app_config_file) ? require( app_config_file ) : {};
  const host = runConfig.host || "localhost";
  const port = runConfig.port || 80;
  
  const config = {
    mode:"development",
    devtool:"(none)",
    target:"web",
    entry:entryMap,
    output: {
      path:path.resolve( webroot_path ),
      filename:`${js_path}/[name].js`,
      chunkFilename:`${js_path}/[name].js`,
      publicPath:"/",
    },
    resolve:{
      extensions:[".js", ".json",".css",".less",'.es'],
      alias:{
        "@system":path.resolve(easescript_root, "javascript/system"),
        "@es":path.resolve(easescript_root,"es"),
        "@src":project_config.workspace,
        "@style":path.resolve(easescript_root,"style")
      },
      modules:[
        process.cwd(),
        easescript_root,
        path.resolve(easescript_root, "javascript"),
        path.resolve(process.cwd(), "node_modules"),
      ]
    },
    devServer: {
      contentBase:path.resolve( webroot_path ),
      hot:true,
      host:host,
      port:port,
      open:true,
      proxy:runConfig.proxy
    },
    watch:true,
    watchOptions:{
        ignored: /node_modules/
    },
    module: {
      rules: [
        {
          test: /(\.es)|(javascript\\system\\[a-zA-Z]+\.js)|(\.html)$/,
          include:[
            path.resolve(easescript_root, "javascript"),
            path.resolve(easescript_root, "es"),
            project_config.workspace
          ],
          use: [
            {
              loader:es.loader,
              options:{
                mode:"development",
                bootstrap:(config,modules)=>{
                  return createBootstrap(project_config, modules)
                },
                es_project_config:Object.assign({},project_config),
                styleLoader:[
                  'style-loader',
                  'css-loader'
                ],
                onlyLocals:false,
                globalVars:lessOptions.globalVars,
                paths:lessOptions.paths
              },
            }
          ]
        },
        {
          test:/\.(less|css)$/i,
          use: [ 
            {
              loader:'style-loader'
            },
            {
              loader:'css-loader',
              options:{
                onlyLocals:false
              }
            },
            {
              loader:'less-loader',
              options:lessOptions
            }
          ],
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          use: [
            {
              loader:'file-loader',
              options:{
                outputPath:font_path
              }
            }
          ],
        },
        {
          test:/\.(jpg|jpeg|png|svg|gif)/,
          use:[
            {
              loader:'url-loader',
              options:{
                limit:8129,
                fallback:'file-loader',
                outputPath:img_path
              }
            }
          ]
        }
      ]
    },
    plugins: [
       new htmlWebpackPlugin({
          "template": path.join(project_config.project.path,"index.html"),
       })
    ],
    optimization:{
      removeEmptyChunks:true,
      usedExports:true
    }
  };

  
  if( INSTALL_OPTIONS.chunk )
  {
      config.optimization.splitChunks={
        chunks: 'all',
        minSize: 30000,
        maxSize: 0,
        minChunks:1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -20,
            name:"vendor"
          },
          core: {
            test: /[\\/]easescript[\\/]es[\\/]/,
            priority:-10,
            name:"core"
          },
          default: {
            minChunks: 2,
            priority: -30,
            reuseExistingChunk: true,
            name:"common"
          }
        }
      };

      //config.optimization.runtimeChunk={
      //   name: 'runtime'
      // };
  }

  webpackDevServer.addDevServerEntrypoints(config, config.devServer);
  const compiler = webpack( config );
  const server = new webpackDevServer(compiler, config.devServer);
  const suffixs = [project_config.skin_file_suffix.slice(1), project_config.suffix.slice(1)].join("|");
  const rebuildSuffix = new RegExp( `\\.(${suffixs})$`,"i");  
  const done=( stats, project_config)=>{
          
    if( !fs.existsSync(project_config.build.child.bootstrap.path) )
    {
        fs.mkdirSync( project_config.build.child.bootstrap.path );
    }

    fs.writeFileSync( path.join(project_config.build.child.bootstrap.path,"config.json"), JSON.stringify(runConfig||{}) );

    if( started === false )
    {
        started = true;
        server.listen( port , host, () => {

            //运行应用服务
            Task.runServer(server.app, project_config);

            //在没有匹配到服务的情况下，始终输出index.html内容
            if( !INSTALL_OPTIONS.server_render )
            {
                server.app.use(function(req, res, next){
                    var content = stats.compilation.assets[ "index.html" ] ? stats.compilation.assets[ "index.html" ].source() : null;
                    res.status( content ? 200 : 404 );
                    res.send( content || ("Not found "+req.path) );
                });
            }
            console.log(`\nDevServer listening on ${host}:${port}\n`);

        });
    }

    Task.after( project_config );
    es.outputDoneInfo( project_config );
  }

  //监听入口文件是否有变化
  const onChange = (filename)=>{

    if( !rebuildSuffix.test(filename)  )
    {
        return;
    }

    const oldModules = {};
    bootstrap.forEach( module=> {
       oldModules[module.fullclassname]=module;
    });

    const newModules = {};
    const modules = es.getBootstrap( project_config );
    modules.forEach( module=> {
       newModules[module.fullclassname]=module;
    });

    const addModules = modules.filter( module=> !oldModules[ module.fullclassname ] );
    const delModules = bootstrap.filter( module=> !newModules[ module.fullclassname ] );

    if( addModules.length > 0 || delModules.length > 0 )
    {
        bootstrapChanged = true;
        bootstrap.splice.apply(bootstrap, [0, bootstrap.length].concat(modules) );
        createBootstrap(project_config, bootstrap );
    }

  }

  var watchConfig = chokidar.watch(app_config_file, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  var watchProject = chokidar.watch(project_config.project.child.src.path, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  var bootstrapChanged = true;
  var started = false;
  var watching = false;
  watchProject.on("add",onChange);
  watchProject.on("change",onChange);
  watchProject.on("unlink",onChange);

  process.on("SIGINT", ()=>{
    server.close( ()=>{
        console.log(`\nDevServer disconnected on ${host}:${port}\n`);
    });
    watchProject.close();
    watchConfig.close();
  });

  process.on("exit", ()=>{
      server.close( ()=>{
          console.log(`\nDevServer disconnected on ${host}:${port}\n`);
      });
      watchProject.close();
      watchConfig.close();
  });

  compiler.hooks.done.tap("devServer", (stats)=>{

      if( INSTALL_OPTIONS.server_render && project_config.service_provider_syntax ==="node" )
      {
          if(!bootstrapChanged)
          {
              return;
          }
          bootstrapChanged = false;
          const chunkModules = bootstrap.map( module=>module.fullclassname.replace(/\./g,'-') )
          const namedChunks = stats.compilation.namedChunks.values();
          const loadScripts = {};
          var mainScripts = [];
          var chunkScripts = {};
          for(var chunk of namedChunks)
          {
              if( chunkModules.indexOf( chunk.name ) < 0  )
              {
                mainScripts = mainScripts.concat( chunk.files );
              }else
              {
                chunkScripts[ chunk.name ] = chunk.files;
              }
          }
      
          const publicPath = stats.compilation.outputOptions.publicPath;
          bootstrap.forEach( module=>{
              var chunkName = module.fullclassname.replace(/\./g,'-');
              loadScripts[ module.fullclassname ] = mainScripts;
              if( chunkScripts[chunkName] )
              {
                  loadScripts[ module.fullclassname ] = mainScripts.concat( chunkScripts[chunkName] );
              }
        
              if( publicPath )
              {
                  loadScripts[ module.fullclassname ] = loadScripts[ module.fullclassname ].map( value=>publicPath+value );
              }
          });

          const server_config = Object.assign({}, project_config);
          server_config.syntax = project_config.service_provider_syntax;
          server_config.server_render_load_scripts=loadScripts;
          const rebuildServer=(filename)=>{
              if( rebuildSuffix.test(filename)  )
              {
                  es.single(server_config,filename, server_config.service_provider_syntax, true );
              }
          }

          const buildServer = ()=>{
              es.build( server_config, function(result,error){
                  if( error ){
                      console.log( error );
                  }else{
                      done(stats, server_config);
                  }
              });
          }

          if( !watching )
          {
              watchConfig.on("change", (filename)=>{
                  delete require.cache[ require.resolve(filename) ];
                  runConfig = require(filename);
                  buildServer();
              });
              watchProject.on("change",rebuildServer);
              watching = true;
          }

          buildServer();
  
      }else
      {
          done(stats, project_config);
      }
  });

}

start();
