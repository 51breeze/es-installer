import path from "path";
import fs from "fs";
import esConfig from './es.config.js';
import readyHook from 'es-nuxt/lib/readyHook';

const plugins = [];
const optimizeDeps = ['vue','element-plus'];
function createCkeditorOptimizeDeps(){
    const root = path.join(__dirname, 'node_modules/@ckeditor/vite-plugin-ckeditor5');
    if( fs.existsSync(root) ){
        const ckeditor5Plugin = require('@ckeditor/vite-plugin-ckeditor5');
        const commonjsPlugin = require('@rollup/plugin-commonjs');
        plugins.push(ckeditor5Plugin({
            theme: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
        }));
        plugins.push( commonjsPlugin({
            include:/color-convert[\\\\\/](\w+)\.js/
        }));
        const dirs = fs.readdirSync( path.dirname(root) );
        const excludes = ['ckeditor5-theme-lark','vite-plugin-ckeditor5','ckeditor5-vue'];
        const deps = dirs.filter( dir=>!excludes.includes(dir) ).map( dir=>'@ckeditor/'+dir );
        optimizeDeps.push('lodash-es');
        optimizeDeps.push( ...deps );
    }
}
createCkeditorOptimizeDeps();


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    rootDir:__dirname,
    srcDir:"src/",
    extensions:['.es'],
    pages:true,
    dir:{
        pages:'pages',
        assets:'assets'
    },
    alias:{
        "element-plus":path.join(__dirname, 'node_modules', 'element-plus'),
    },
    css:[
        'element-plus/theme-chalk/base.css'
    ],
    hooks: {
        ready:(nuxt)=>{
            readyHook(esConfig)(nuxt);
        }
    },
    nitro:{
        devProxy:{
            "/api":{
                target:"http://localhost:8000",
                pathRewrite:{
                    "^/api":""
                }
            }
        },
        routeRules: {
            '/api/**': {
                proxy: 'http://localhost:8000/**'
            },
        },
    },
    vite:{
        optimizeDeps:{
            include: [...optimizeDeps],
        },
        plugins:[...plugins],
        server:{
            proxy:{
                "/api":{
                    target:"http://localhost:8000",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            }
        }
    }

})
