const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const easescript_root = path.dirname( path.dirname(require.resolve("easescript") ) );
const es = require("easescript");
const builder = require("easescript/javascript/builder");
const webpackDevServer = require('webpack-dev-server');
const htmlWebpackPlugin = require('html-webpack-plugin');
const {spawn} = require('child_process');

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

  const chunks = modules.map( module=>{
      var name = `import(/*webpackChunkName:"${module.fullclassname.replace(/\./g,'-')}"*/ "${module.filename}" )`;
      if( module.isDefaultBootstrapModule )
      {
        var method = module.defineMetaTypeList.Router ?  module.defineMetaTypeList.Router.param.default : '';
        name+=`.then(function(module){
            var obj = new (module.default || module)();
            ${method ? "obj."+method+"()" : 'console.log("No default method is specified.")' };
        })`;
      }
      return name;
  });

  const content = `import "@style/less/main.less";
                  import Event from '@system/Event.js';
                  import System from '@system/System.js';
                  var global = System.getGlobalEvent();
                  global.addEventListener(Event.READY,function (e) {
                   ${chunks.join(";\n")}
                  },false,-500);`;

   const file = path.join(config.project.path,"bootstrap.js");
   fs.writeFileSync( file, content.replace(/[\s]{3,}/g,'\n') );
   return file;
}

var initConfig = false;
function start()
{
  var config_path = findConfigPath( process.cwd() );
  if( !config_path && !initConfig )
  {
    initConfig = true;
    const package = require( path.join(process.cwd(),'package.json') );
    const cmd = package.scripts.dev+" --init";
    const args = cmd.split( /\s+/g ).slice(1);
    const child = spawn("node", args, {cwd:process.cwd(),stdio: 'inherit'});
    child.on("close",start);
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

  const bootstrap = es.getBootstrap( project_config );
  const entryIndex = createBootstrap(project_config, bootstrap );

  const config = {
    mode:"development",
    devtool:"(none)",
    entry:{"index":entryIndex},
    output: {
      path:path.resolve( project_config.build_path ),
      filename: './js/[name].js',
      chunkFilename:'./js/[name].js',
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
      contentBase:path.resolve( project_config.build_path ),
      hot:true,
      host:'localhost',
      open:true
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
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|jpeg|gif)$/,
          use: ['file-loader'],
        },
      ]
    },
    plugins: [
       new htmlWebpackPlugin({
          "template": path.join(project_config.project.path,"index.html"),
       })
    ],
    optimization: {
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
    }
  };

  webpackDevServer.addDevServerEntrypoints(config, config.devServer);
  var compiler = webpack( config );
  const server = new webpackDevServer(compiler, config.devServer);
  server.listen(8080, 'localhost', () => {
    console.log('dev server listening on port 8080');
  });
}

start();


