#!/usr/bin/env node  
const create = require('./depends.js');
const inquirer =  require('inquirer');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Utils = require('./utils');
const questions = [
    {
        type: 'input',
        message: '项目名:',
        name: 'project_path',
        default: "./project",
        validate:function(val){
            if(val){
                let dirname = path.resolve(process.cwd(), val);
                if(fs.existsSync(dirname)){
                    if(fs.statSync(dirname).isDirectory()){
                        if(fs.readdirSync(dirname).filter(name=>!(name==='.' || name==='..')).length>0){
                            return "指定工程目录当前不为空,请重新输入目录名或者先清除后再试"
                        }
                    }else{
                        return "指定工程目录是一个已存在的文件,请重新输入目录名"
                    }
                }
                return true;
            }else{
                return "项目名不能为空";
            }
        }
    },
    {
        type: 'input',
        message: '构建路径:',
        name: 'build_path',
        default: "./build",
        validate:function(val){
            return val ? true : "构建路径不能为空";
        }
    },

    {
        type: 'list',
        message: '应用场景:',
        name: 'scene',
        choices: [
            {name:"Nuxt(Web多页应用、预渲染、SEO)", value:"es-nuxt"},
            {name:"Vue(Web单页应用)", value:"es-vue"},
            {name:"Thinkphp", value:"es-thinkphp"},
            {name:"Php", value:"es-php"},
            {name:"Js", value:"es-javascript"},
        ]
    },

    // {
    //     type: 'checkbox',
    //     message: '语法插件:',
    //     name: 'plugins',
    //     choices: [
    //         "es-javascript",
    //         {name:"es-vue(单页应用)", value:"es-vue"},
    //         {name:"es-nuxt(多页应用、预渲染、SEO)", value:"es-nuxt"},
    //         //"es-uniapp",
    //         "es-php",
    //         {name:"es-thinkphp(API)", value:"es-thinkphp"},
    //     ]
    // }
];

const apis = {
    type: 'list',
    message: '后端接口:',
    name: 'plugin',
    choices: [
        {name:"不需要", value:""},
        {name:"Thinkphp", value:"es-thinkphp"},
    ]
};

const ckeditorComponents = {
    type: 'list',
    message: '富文本组件(Ckeditor):',
    name: 'installCkeditor',
    choices: [
        {name:"不需要", value:"no"},
        {name:"安装", value:"yes"},
    ]
};

const nowInstall = {
    type: 'list',
    message: '安装依赖:',
    name: 'install',
    choices: [
        {name:"立即", value:"yes"},
        {name:"稍后", value:"no"},
    ]
};

const vueVersion = {
    type: 'list',
    message: '选择VUE版本',
    name: 'version',
    choices: [
        "vue@2",
        "vue@3",
    ]
};

async function start(questions){
    const result = await inquirer.prompt(questions);
    result.plugins = [result.scene];
    if(result && ['es-vue','es-nuxt'].includes(result.scene)){
        result.vue_version =  'vue@3';
        const components = await inquirer.prompt([ckeditorComponents]);
        result.installCkeditor = components.installCkeditor==='yes';
        const api = await inquirer.prompt([apis]);
        if(api && api.plugin){
            result.plugins.push(api.plugin)
        }
    }
    const now = await inquirer.prompt([nowInstall]);
    result.install = now.install;
    return result;
}

start(questions).then( (result)=>{
    const [config,tasks] = create( result );
    if( result.install ==='yes' ){
        const modules_path = path.join( config.project_path, 'node_modules');
        const package_lock_path = path.join( config.project_path, 'package-lock.json');
        if( fs.existsSync(modules_path) ){
            console.info( chalk.bgCyan( `\r\nRemove already dependencies. please wait moment...` ) );
            Utils.unlink( modules_path );
            Utils.unlink( package_lock_path );
        }
        
        Utils.exec('npm install',{cwd:config.project_path});
        tasks.forEach( task=>task(true) );
        console.info( chalk.bgGreen( `\r\nCreate successful!` ) );
        console.info( chalk.green( 'Project path: `cd '+config.project_path+'`' ) );
        console.info( chalk.green( 'Run project: `npm run dev`' ) );
    }else{
        tasks.forEach( task=>task(false) );
        console.info( chalk.bgGreen( `\r\nCreate successful!` ) )
        console.info( chalk.green( 'Project path: `cd '+config.project_path+'`' ) );
        console.info( chalk.green( 'Install dependencies: `npm install`' ) );
        console.info( chalk.green( 'Run project: `npm run dev`' ) );
    }
});