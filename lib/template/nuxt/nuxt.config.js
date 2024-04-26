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
        /* Fix Nuxt 3.11.2 
        * WARN  "file:///D:/workspace/wwwweb3/node_modules/nuxt/dist/core/runtime/nitro/cache-driver.js" is imported by "virtual:#internal/nitro/virtual/storage",
        * but could not be resolved – treating it as an external dependency.
        */
        rollupConfig:{
            plugins:[
                {
                    name:'resolve:nitro-cache-driver',
                    resolveId:(id)=>{
                        if(id && id.includes('core/runtime/nitro/cache-driver')){
                            return id.startsWith('file:///') ? id.substring(8) : id;
                        } 
                    }
                }
            ]
        },
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
            include:['lodash-es']
        },
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
