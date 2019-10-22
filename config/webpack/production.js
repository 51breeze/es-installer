process.env.NODE_ENV="production";
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const easescript_root = path.dirname( path.dirname(require.resolve("easescript") ) );
const es = require("easescript");
const builder = require("easescript/javascript/builder");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin');
const {spawn} = require('child_process');
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


function createBootstrap( config, modules )
{
  var router = builder.routerListToJsonString( es.compilation.getServiceRoutes( modules ) );
  const bootstrapModule = modules.filter( module=>!!module.isDefaultBootstrapModule )[0] || modules[0];
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
    "WORKSPACE":config.workspace.replace(/\\/g,"/"),
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
                      };
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


function clean( dir )
{
   if( fs.existsSync(dir) && fs.statSync( dir ).isDirectory() )
   {
      fs.readdirSync(dir).forEach( (file)=>{
          file = path.join(dir, file );
          const stat = fs.statSync(file);
          if( stat.isDirectory() )
          {
              clean( file );
              fs.rmdirSync( file );
          }else{
              fs.unlinkSync( file );
          }
      });
  }
}

var initConfig = false;
var hasInitConfig = false;
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

  initConfig = true;
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
  
  if( hasInitConfig )
  {
    hasInitConfig = false;
    if( typeof fs.copyFileSync === "function" ){
        fs.copyFileSync( INSTALL_WELCOME_PATH, path.join(project_config.project.child.src.path,"Welcome.es") );
    }else{
        fs.createReadStream(INSTALL_WELCOME_PATH).pipe( fs.createWriteStream( path.join(project_config.project.child.src.path,"Welcome.es") ) );
    } 
  }

  clean( project_config.build.path );
  
  const bootstrap = es.getBootstrap( project_config );
  const entryMap = {
    "index":createBootstrap(project_config, bootstrap )
  };

  const webroot_path = project_config.build.child.webroot.path;
  const js_path = path.relative( webroot_path, project_config.build.child.js.path  );
  const font_path = path.relative( webroot_path, project_config.build.child.font.path  );
  const img_path = path.relative( webroot_path, project_config.build.child.img.path  );
  const css_path = path.relative( webroot_path, project_config.build.child.css.path  );

  const config = {
    mode:"production",
    devtool:"(none)",
    entry:entryMap,
    output: {
      path:path.resolve( webroot_path ),
      filename:js_path+'/[name].[contenthash].js',
      chunkFilename:js_path+'/[name].[contenthash].js',
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
                mode:"production",
                es_project_config:project_config,
                styleLoader:[
                  MiniCssExtractPlugin.loader.replace(/\\/g,'/'),
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
              loader:MiniCssExtractPlugin.loader,
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
       new MiniCssExtractPlugin({
         filename:css_path+"/[name].[contenthash].css",
         chunkFilename:css_path+"/[name].[contenthash].css",
       }),
       new htmlWebpackPlugin({
        "template": path.join(project_config.project.path,"index.html"),
       })
    ]
    
  };

  if( INSTALL_OPTIONS.chunk )
  {
    config.optimization={
      splitChunks: {
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
            priority: -10,
            name:"vendor"
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            name:"common"
          }
        }
      },
      runtimeChunk: {
        name: 'runtime'
      }
    };
  }

  var compiler = webpack( config );
  compiler.run(function(){
    console.log( "build completed!"  )
  });

}

start();


