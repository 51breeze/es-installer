const utils={};
const fs = require('fs');
const PATH = require('path');
const Colors = require('colors');
Colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});

function info( msg ){console.log( msg.info );}
utils.info = info;
function silly( msg ){console.log( msg.silly );}
utils.silly = silly;
function input( msg ){console.log( msg.input );}
utils.input = input;
function verbose( msg ){console.log( msg.verbose );}
utils.verbose = verbose;
function prompt( msg ){console.log( msg.prompt );}
utils.prompt = prompt;
function data( msg ){console.log( msg.data );}
utils.data = data;
function help( msg ){console.log( msg.help );}
utils.help = help;
function warn( msg ){console.log( msg.warn );}
utils.warn = warn;
function debug( msg ){console.log( msg.debug );}
utils.debug = debug;
function error( msg ){console.log( msg.error );}
utils.error = error;

/**
 * 获取文件内容
 * @param filepath
 * @returns {*}
 */
function getContents( filepath )
{
    return fs.readFileSync( filepath , 'utf-8');
}
utils.getContents=getContents;

/**
 * 设置文件的内容
 * @param filepath
 * @returns {*}
 */
function setContents( filepath, contents )
{
    utils.mkdir( PATH.dirname(filepath) );
    return fs.writeFileSync(filepath, contents );
}
utils.setContents=setContents;

/**
 * 获取目录下的所有文件
 * @param path
 * @returns {Array}
 */
function getDirectoryFiles( path )
{
    var files = fs.readdirSync( path );
    return files.filter(function(a){
        return !(a==='.' || a==='..');
    });
}
utils.getDirectoryFiles=getDirectoryFiles;

/**
 * 判断是否为一个目录
 * @param path
 * @returns {boolean}
 */
function isDir( path ) {

    var fileStat = isFileExists(path) ? fs.statSync(path) : null;
    return fileStat ? fileStat.isDirectory() : false;
}
utils.isDir = isDir;

/**
 * 返回一个完整的绝对路径
 * @param dir
 * @param path
 * @returns {*}
 */
function getResolvePath( dir, path )
{
    return PATH.resolve( dir, (path || '').replace(/\./g,PATH.sep) ).replace(/\\/g,'/');
}
utils.getResolvePath=getResolvePath;

/**
 * 返回一个指定路径到另一个路径的相对目录
 * @param from
 * @param to
 * @returns {*}
 */
function getRelativePath( from, to )
{
    return PATH.relative( from, (to || '').replace(/\./g,PATH.sep) ).replace(/\\/g,'/');
}
utils.getRelativePath=getRelativePath;


function getBuildPath(config, path, prop)
{
    prop = prop===null ? '': ( prop ? '.'+prop : '.path');
    if( path.substr(0,7)==='config.' )path = path.substr(8);
    if( path.substr(0,6)==='build.' )path = path.substr(6);
    if( path==='build' )path ='';
    if( path ) {
        path = path.split('.');
        path.unshift('build');
        path = 'config.' + path.join('.child.') + prop;
    }else{
        path = 'config.build'+ prop;
    }
    return eval("("+path+")");
}
utils.getBuildPath=getBuildPath;


utils.copyfile=function(src, to){
    if( typeof fs.copyFileSync === "function" ){
        fs.copyFileSync( src,  to );
    }else{
        fs.createReadStream(src).pipe( fs.createWriteStream(to) );
    }
}


function mkdir( dirpath )
{
    dirpath = dirpath.replace(/\./g,"/").replace(/^\/|\/$/g,'');
    var dirpath = PATH.isAbsolute(dirpath) ? dirpath : PATH.resolve( dirpath );
    dirpath = dirpath.replace(/\\/g,'/');
    dirpath = dirpath.split("/");
    var i = 0;
    var base='';
    if( /\w+\:/.test( dirpath[0] ) )
    {
        i=1;
        base = dirpath[0];
    }

    for( ;i<dirpath.length; i++)
    {
        base+='/'+dirpath[i];
        if( !fs.existsSync( base ) )
        {
            fs.mkdirSync( base );
        }
    }
    return base;
}
utils.mkdir = mkdir;


function isEmpty( obj )
{
    if( !obj )return true;
    var ret=true;
    for( var i in obj){
        ret=false;
        break;
    }
    return ret;
}
utils.isEmpty=isEmpty;


/**
 * 去掉两边的空白
 * @param str
 * @returns {string|void|XML}
 */
function trim( str )
{
    return typeof str === "string" ? str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'') : '';
}
utils.trim = trim;


utils.hash = function hash(str, len)
{
    var map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var val="";
    len = len || 8;
    str = utils.MD5(str,len);
    for(var i=0; i<len; i++){
        var g = str.charCodeAt(i);
        val+=map[ ( g ^ str.charCodeAt( i ) ) - g & 0x33 ];
    }
    return val;
}

utils.forEach=function forEach(target, callback, thisArg )
{
    if( !target )return;
    thisArg = thisArg||target;
    for( var i in target)
    {
        if( target.hasOwnProperty(i) )
        {
            callback.call(thisArg, target[i], i );
        }
    }
}

utils.toKeys=function toKeys(object)
{
    var item=[];
    utils.forEach(object,function (val,key) {
        item.push(key);
    })
    return item;
}




module.exports = utils;