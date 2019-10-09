const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const easescript_root = require.resolve("easescript");
const loader = require.resolve("easescript/lib/loader");
const builder = require("easescript/javascript/builder");
const {spawn} = require('child_process');

function findConfigPath( cwd )
{
  while( fs.lstatSync( dir ).isDirectory() && path.parse(dir).name )
  {
    var config_path = path.resolve(cwd, '.esconfig');
    if( !fs.existsSync(config_path) )
    {
        return findConfigPath( path.dirname( cwd ) ); 
    }
    return config_path;
  }
  return null;
}

var initConfig = false;
function start()
{
  var config_path = findConfigPath( process.cwd() );
  if( !config_path && !initConfig )
  {
    initConfig = true;
    const package = require( path.join(process.cwd(),'package.json') );
    const cmd = package.scripts.build+" --init";
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

  const project_config = JSON.parse( fs.readFileSync( config_path ) );
  const lessOptions = {
    globalVars:builder.getLessVariables( project_config ),
    paths:[
        path.resolve(easescript_root,'style'),
    ]
  };

  const config = {
    mode:"production",
    devtool:"(none)",
    entry:{
      'index': path.resolve(__dirname,'main.js'),
    },
    output: {
      path:path.resolve('./test/build'),
      filename: './js/[name].bundle.js',
      chunkFilename:'./js/[name].bundle.js',
    },
    resolve:{
      extensions:[".js", ".json",".css",".less",'.es'],
      alias:{
        "@system":path.resolve(easescript_root, "javascript/system"),
        "@core":easescript_root,
        "@src":project_config.workspace,
        "@style":easescript_root
      },
      modules:[
        path.resolve( process.cwd() ),
        path.resolve(easescript_root, "es"),
        path.resolve(easescript_root, "javascript/system"),
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
            process.cwd()
          ],
          use: [
            {
              loader:loader,
              options:{
                mode:"production",
                styleLoader:[
                  MiniCssExtractPlugin.loader.replace(/\\/g,'/'),
                  'css-loader',
                  'less-loader'
                ],
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
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|jpeg|gif)$/,
          use: ['file-loader'],
        },
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({filename: "./css/[name].css"}),
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

  var compiler = webpack( config );
  compiler.run(function(){
    console.log( "==ok==="  )
  });

}

start();


