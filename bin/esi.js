#!/usr/bin/env node  
const program = require('commander');
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
program.parse(process.argv);

if(program.init){
    require('../lib/index.js');
}else{
    program.outputHelp();
}