const Utils = require('../utils.js');
const chalk = require('chalk');
const PATH = require('path');

function checkComposer(){
    const res = Utils.exec(`composer --version`, {stdio:'pipe'});
    if(res){
        return !(res instanceof Error);
    }
    return false
}

function installThinkPHP(output){
    return (yes, version='6.x.x')=>{
        const name = PATH.basename(output);
        if( Utils.isDir(output) ){
            if( Utils.readdir( output ).length > 0 ){
                if( yes ){
                    console.info( chalk.bgYellow(`\r\nthinkphp frameworks was not initialized, because the '${name}' directory is not empty.`) );
                    return false;
                }
            }
        }
        if( yes && checkComposer() ){
            const res = Utils.exec(
                `composer create-project topthink/think=${version} ${name}`,
                {
                    cwd:PATH.resolve(PATH.dirname(output)),
                    stdio: [null,1,2]
                }
            );
            if(res && res instanceof Error){
                console.info( chalk.bgRed( `\r\n${res.message}` ) );
                return false;
            }
            return true;
        }else{
            if(yes){
                console.info( chalk.bgRed(`\r\nNot found composer. needs to manually install it.`) );
            }
            console.info( chalk.bgYellow(`\r\nAfter successfully installing the composer, follow these steps:`) );
            console.info( chalk.yellow(`1、cd ${PATH.dirname(output)}`) );
            console.info( chalk.yellow(`2、composer create-project topthink/think=${version} ${name}`) );
            return true;
        }
    };
}

module.exports = {
    thinkphp:installThinkPHP
}