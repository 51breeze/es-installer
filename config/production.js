process.env.NODE_ENV="production";
const path = require("path");
const fs = require("fs");
const es = require("easescript");
const builder = require("easescript/javascript/builder");
const watch = require("easescript/lib/watch");
const {spawn} = require('child_process');
const Task = require('./task.js');
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

  if( !fs.existsSync(config_path) )
  {
     throw new Error("Not found project config file.");
  }

  const project_config =  es.createConfigure( JSON.parse( fs.readFileSync( config_path ) ) );
  const runConfig = require( path.join(project_config.project.path, "config.js") );

  project_config.mode = 3;
  project_config.minify = true;
  project_config.build_pack = true;
  project_config.module_suffix = ".js";

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

  Task.before( project_config );
  es.build( project_config, function(results){
     fs.writeFileSync( path.join(project_config.build.child.bootstrap.path,"config.json"), JSON.stringify(runConfig.production||{}) );
     Task.after( project_config );
  });

}

start();


