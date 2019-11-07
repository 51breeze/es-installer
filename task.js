const fs = require("fs");
const path = require('path');
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

module.exports={
    before:( project_config )=>{
        clean( project_config.build.path );
    },
    after:( project_config )=>{
        //todo zip files
    }
}