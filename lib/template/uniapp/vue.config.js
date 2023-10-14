const path = require('path');
const workspace = path.resolve( "./src" )
const esVue = {
  plugin:require('../index.js'),
  options:{
    webpack:true,
    useAbsolutePathImport:true,
    sourceMaps:false,
    version:2,
    uniapp:true,
    srcCSS:false,
    optimize:true,
    hot:true,
    format:'vue-template', //vue-template
    babel:false,
    workspace
  }
}

const vueLoader = require('@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/index.js');

module.exports = {
  //transpileDependencies:['@dcloudio/uni-ui'],
  chainWebpack(chain){

    chain.merge({
        resolve:{
          extensions:['.es']
        },
        module: {
          rule: {
            esloader: {
              test: /\.es$/,
              use: [
                {
                    loader: require.resolve('es-loader'),
                    options:{
                        mode:"development",
                        builder:esVue,
                        vueLoader,
                    },
                },
              ],
            },
          },
        },
    });

  }
}