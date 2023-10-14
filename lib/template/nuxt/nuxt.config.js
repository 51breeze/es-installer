import path from "path";
import esConfig from './es.config.js';
import readyHook from './scripts/readyHook.js';
import {merge} from "lodash";
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
            readyHook(nuxt, esConfig)
        }
    },
    nitro:{
        devProxy:merge({
            "/api":{
                target:"http://localhost:8000",
                pathRewrite:{
                    "^/api":""
                }
            }
        }, esConfig.devServer.proxy)
    }
})
