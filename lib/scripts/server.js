const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
function findProgram( programName ){
    const cache = Object.create(null);
    const find=(pathname)=>{
        const key = pathname;
        if( cache[key] ===true )return null;
        cache[key] = true;
        const name = programName ==='mysql' ? 'mysqld.exe' : programName+'.exe';
        let file = path.join(pathname, name);
        if( fs.existsSync(file) ){
            return file;
        }
        if( programName ==='mysql' ){
            file = path.join(pathname,'bin', name)
            if( fs.existsSync( file ) ){
                return file;
            }
        }
        return null;
    }
    const resolve=(pathname)=>{
        let result = find(pathname);
        if( result ){
            return [result];
        }
        const info = path.parse(pathname);
        if( info.base && info.name){
            const results = [];
            if( !/[\\\/]windows[\\\/]/i.test(pathname) ){
                const stat = fs.statSync(pathname);
                if( stat.isDirectory() ){
                    const files = fs.readdirSync(pathname);
                    for(let i=0;i<files.length;i++){
                        const filename = files[i];
                        if( !(filename ==='.' || filename==='..') ){
                            const result = find( path.join(pathname, files[i]));
                            if( result ){
                                results.push(result)
                            }
                        }
                    }
                }
            }
            result = resolve( info.dir );
            if( result ){
                return results.concat( result );
            }
            return results;
        }
    }
    const keys = Object.keys(process.env);
    const results = [];
    for(let b=0;b<keys.length;b++){
        const key = keys[b];
        const value = process.env[key];
        const lower = key.toLowerCase();
        if( lower==='path' || lower.includes( programName ) ){
            const files = value.split(';');
            for(let i=0;i<files.length;i++){
                if( fs.existsSync(files[i]) ){
                    const result = resolve(files[i]);
                    if( result ){
                        results.push( ...result );
                    }
                }
            }
        }
    }
    return results;
}

module.exports = {
   mysql(){
        return new Promise( (resolve, reject)=>{
            const result = shell.exec(process.platform === "win32" ? 'tasklist | findstr "mysqld.exe"' : 'ps aux | grep mysqld', {silent: true});
            if(result.code===0){
                resolve({
                    result:true,
                    error:null
                });
            }else{
                if(process.platform === "win32"){
                    if(shell.exec('net start mysql',{silent: true}).code===0){
                        return resolve({
                            result:true,
                            error:null
                        });
                    }else if(shell.exec('net start autoLaunchMysqlService',{silent: true}).code===0){
                        return resolve({
                            result:true,
                            error:null
                        });
                    }
                }else{
                    if(shell.exec('sudo systemctl start mysql',{silent: true}).code===0){
                        return resolve({
                            result:true,
                            error:null
                        });
                    }else{
                        return resolve({
                            result:false,
                            error:'Start mysql service failed.'
                        });
                    }
                }

                let findResult = null
                if( process.platform === "win32" ){
                    findResult = findProgram('mysql')
                }
                if(!findResult){
                    findResult = shell.which('node');
                    if(findResult){
                        findResult = [findResult.stdout]
                    }
                }
                if(findResult && findResult.length>0){
                    if(process.platform === "win32"){
                        const file = findResult[0];
                        const info = path.parse(file);
                        const cmd = info.base + ' --install autoLaunchMysqlService';
                        const install = shell.exec(cmd, {cwd:info.dir})
                        if(install.code===0){
                            const result = install.exec('net start autoLaunchMysqlService', {silent: true});
                            if(result.code===0){
                                return resolve({
                                    result:true,
                                    error:null
                                });
                            }else{
                                return resolve({
                                    result:false,
                                    error:'Start mysql service failed.'
                                });
                            }
                        }
                    }
                }else{
                    resolve({
                        result:false,
                        error:'Not found mysqld.'
                    });
                }
            }
        })
    },
    thinkphp(runtimePath, port=null, host=null){
        if(runtimePath && !path.isAbsolute(runtimePath)){
            runtimePath = path.join(process.cwd(), runtimePath)
        }
        return new Promise( async(resolve)=>{
            const result = shell.exec(process.platform === "win32" ? 'tasklist | findstr "php"' : 'ps aux | grep php', {silent: true});
            if(result.code===0){
                console.info('Trying to close running php process');
                let processItems = [];
                if(process.platform === "win32"){
                    processItems = result.stdout.matchAll(/\b(\d+)\s+Console\b/gi)
                }else{
                    processItems = result.stdout.split(/[\r\n]+/)
                                    .filter( line=>/\bphp\s+think\s+run\b/i.test(line) )
                                    .map( val=> val.match(/^\w+\s+(\d+)/) ).filter(Boolean)
                }
                await Promise.allSettled(Array.from(processItems).map( ([str, pid])=>{
                    return new Promise((resolve)=>{
                        const callback = (code)=>{
                            if(code !== 0){
                                console.info(`Kill php process failed. pid:${pid}`)
                            }
                            resolve();
                        }
                        if(process.platform === "win32"){
                            shell.exec(`taskkill /F /PID ${pid}`,callback)
                        }else{
                            shell.exec(`pkill ${pid}`,callback)
                        }
                    });
                }));
            }

            const _host = host ? ` -H ${host}` : '';
            const _port = port ? ` -p ${port}` : '';
            const cmd = `php think run${_port}${_host}`;
            const subprocess = shell.exec(cmd,{
                cwd:runtimePath||process.cwd()
            },(code, std, err)=>{
                resolve({
                    result:code===0,
                    error:err
                })
            });
            process.on('exit',()=>{
                subprocess.kill();
            });

        });
    }
}
