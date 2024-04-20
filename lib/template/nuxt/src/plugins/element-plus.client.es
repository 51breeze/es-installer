import {ID_INJECTION_KEY} from 'element-plus/es/hooks/use-id'
export default defineNuxtPlugin(nuxtApp=>{
    nuxtApp.vueApp.provide(ID_INJECTION_KEY, {
        prefix:Math.floor(Math.random() * 10000),
        current:0
    })
})