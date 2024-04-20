import esConfig from './es.config.js';
import readyHook from 'es-nuxt/lib/readyHook';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    rootDir:__dirname,
    srcDir:"src/",
    extensions:['.es'],
    modules:['@element-plus/nuxt'],
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
