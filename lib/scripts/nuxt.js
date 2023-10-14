import path from "path";
import readyHook from 'es-nuxt/lib/readyHook';
import esServer from './server.js';
import chalk from 'chalk';
export default (nuxt, esConfig={})=>{
    const isDev = nuxt.options.dev;
    if( isDev ){
        const tasks = [];
        (esConfig.plugins||[]).forEach( (item)=>{
            const name = (item.name || item.plugin).toString()
            if( name ==='es-thinkphp' ){
                let runtimePath = item.options.output;
                if( typeof runtimePath ==='object' ){
                    runtimePath = runtimePath.dev || runtimePath.prod;
                }
                if( !path.isAbsolute(runtimePath) ){
                    runtimePath = path.join(process.cwd(), runtimePath);
                }
                tasks.push(new Promise( async (resolve)=>{
                    const result = await esServer.mysql();
                    if( result.result ){
                        console.info( chalk.bgGreen( `\r\nMysql starting successful!` ) )
                    }else{
                        console.info( chalk.bgRedBright( String(result.error) ) )
                    }
                    const result2 = await esServer.thinkphp(runtimePath);
                    if( result2.result ){
                        console.info( chalk.bgGreen( `\r\nPHP starting successful!` ) )
                    }else{
                        console.info( chalk.bgRedBright( String(result2.error) ) )
                    }
                    resolve(true);
                }));
            }
        });
        nuxt.hook('build:before', async()=>{
            await Promise.all(tasks);
        });
    }
    readyHook(esConfig)(nuxt);
}