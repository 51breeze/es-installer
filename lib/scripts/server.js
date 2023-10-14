const path = require('path');
const fs = require('fs');
const {exec} =  require('child_process');

function execute(cmd, callback=null, options={}){
    if( callback && typeof callback ==='object' ){
        options = callback;
        callback = null;
    }
    try{
        let subprocess = null;
        options = Object.assign({cwd:process.cwd(),stdio: 'inherit'}, options);
        if( process.platform === "win32" ){
            options.shell='powershell.exe';
            if(cmd.substring(0,4) ==='npm ' ){
                cmd = 'npm.cmd '+cmd.slice(4);
            }
            subprocess = exec(cmd, options,(e, o, st)=>{
                if(callback)callback(e, o, st)
            });
        }else{
            subprocess = exec(cmd, options,(e, o, st)=>{
                if(callback)callback(e, o, st)
            });
        }
        subprocess.stdout.on('data', (data) => {
            if(callback)callback(null,String(data))
        });
        subprocess.stderr.on('data', (data)=>{
            if(callback)callback(String(data))
        });
        process.on('exit',()=>{
            subprocess.kill();
        });
        return subprocess;

    }catch(e){
        if(callback)callback(e)
    }
}

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
            execute('tasklist | findstr "mysqld.exe"', (error, output, std)=>{
                if( output && /mysqld\.exe\s+\d+/.test(output) ){
                    resolve({
                        result:true
                    });
                }else{
                    execute('net start mysql', (error, output, std)=>{
                        if( output && (output.includes('成功') || output.includes('successfully')) ){
                            resolve({
                                result:true
                            });
                        }else{
                            const results = findProgram('mysql');
                            if( results && results.length > 0 ){
                                const file = results[0];
                                const info = path.parse(file);
                                const cmd = './'+info.base;
                                execute(cmd, (error, output, std)=>{
                                    if( !error ){
                                        resolve({
                                            result:true
                                        });
                                    }else{
                                        reject({
                                            result:false,
                                            error:error
                                        });
                                    }
                                },{cwd:info.dir});
                                
                            }else{
                                resolve({
                                    result:false,
                                    error:'Not found mysql.'
                                });
                            }
                        }
                    }); 
                }
            });
        })
    },
    thinkphp(runtimePath){
        return new Promise( (resolve)=>{
            let resolveFlag = false;
            let timerId = null;
            execute('php think run',(error,output,std)=>{
                if( !resolveFlag ){
                    if( error ){
                        resolveFlag = true;
                        clearTimeout(timerId);
                        resolve({result:false,error});
                    }else if(output.includes('started')){
                        resolveFlag = true;
                        clearTimeout(timerId);
                        resolve({result:true});
                    }
                }
            },{cwd:runtimePath});
            timerId = setTimeout( ()=>{
                clearTimeout(timerId);
                resolve({result:false,error:'php start failed.'});
            },10000)
        });
    }
}
