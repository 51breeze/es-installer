#!/usr/bin/env node  
const path = require('path');
const fs = require('fs');
const program = require('commander');
const utils = require('../lib/utils.js');

program.option('-V, --version', '当前版本号');
program.on('option:version', function() {
    const pkg = require('../package.json')
    const version =pkg.name+' v'+pkg.version;
    process.stdout.write(version + '\n');
    process.exit(0);
});

program.description('Create Development Framework For EaseScript')
program.usage('--init');

program.option('--init', '初始化工程');
program.option('--install, --install [es-thinkphp[:version=6.x.x],...]', '安装环境', '');
program.option('--dir, --dir [path]', '安装路径', '');
program.option('--now, --now [true|false]', '立即执行安装命令', true);
program.parse(process.argv);

if(program.init){
    require('../lib/index.js');
}else if(program.install){
   const install = require('../lib/scripts/install.js');
   const [plugin, version] = program.install.split(':')
   const nameds = {
        'es-thinkphp':'thinkphp'
   }
   const api = install[nameds[plugin]];
   if(api){
        if(typeof api ==='function'){
            let dir = program.dir
            let cwd = process.cwd();
            if(!dir){
                let files = ['es.config.js', 'esconfig.json'].map(file=>{
                    return path.join(cwd, file)
                }).filter(file=>fs.existsSync(file))
                if(files.length>0){
                    for(let file of files){
                        const config = require(file);
                        if(config && Array.isArray(config.plugins)){
                            const item = config.plugins.find(plg=>plg.name===plugin)
                            if(item && item.options && item.options.output){
                                dir = item.options.output;
                                break;
                            }
                        }
                    }
                }
            }

            if(dir){
                if(!path.isAbsolute(dir)){
                    dir = path.join(cwd, dir)
                }
                dir = utils.mkdir(dir)
            }

            if(dir && fs.existsSync(dir) ){
                api(dir)(!program.echo, version)
            }else{
                console.error(`执行目录"${dir}"不存在`)
            }
        }
   }
   
}
else{
    program.outputHelp();
}