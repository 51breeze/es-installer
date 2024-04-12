const utils={};
const fs = require('fs');
const PATH = require('path');
const {execSync} =  require('child_process');

/**
 * 获取目录下的所有文件
 * @param path
 * @returns {Array}
 */
 utils.readdir = function readdir( path ){
    var files = fs.readdirSync( path );
    return files.filter(function(a){
        return !(a==='.' || a==='..');
    });
}

/**
 * 判断是否为一个目录
 * @param path
 * @returns {boolean}
 */
 utils.isDir = function isDir( path ) {
    var fileStat = fs.existsSync(path) ? fs.statSync(path) : null;
    return fileStat ? fileStat.isDirectory() : false;
}

utils.isFile = function isFile( path ) {
    var fileStat = fs.existsSync(path) ? fs.statSync(path) : null;
    return fileStat ? fileStat.isFile() : false;
}

utils.normalizePath = function normalizePath( pathname ){
    return PATH.normalize( pathname ).replace(/\\/g,'/');
}

utils.isEmpty= function isEmpty( obj ){
    if( !obj )return true;
    var ret=true;
    for( var i in obj){
        ret=false;
        break;
    }
    return ret;
}


/**
 * 去掉两边的空白
 * @param str
 * @returns {string|void|XML}
 */
 utils.trim = function trim( str ){
    return typeof str === "string" ? str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'') : '';
}

utils.exec= function(cmd, options={}){
    try{
        options = Object.assign({cwd:process.cwd(),stdio: 'inherit'}, options);
        if( process.platform === "win32" ){
            options.shell='powershell.exe';
            if(cmd.substring(0,4) ==='npm ' ){
                cmd = 'npm.cmd '+cmd.slice(4);
            }
            return execSync(cmd, options);
        }else{
            return execSync(cmd, options);
        }
    }catch(e){
        return e;
    }
}

utils.unlink= function( filepath ){
    if( !fs.existsSync(filepath) ){
        return false;
    }
    filepath = utils.normalizePath( filepath );
    if( process.platform === "win32" ){
        return utils.exec('rm '+filepath+' -r -fo ');
    }else{
        return utils.exec('rm -rf '+filepath);
    }
}

module.exports = utils;