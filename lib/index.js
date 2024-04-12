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
        type: 'checkbox',
        message: '语法插件:',
        name: 'plugins',
        choices: [
            "es-javascript",
            "es-vue",
            "es-nuxt",
            //"es-uniapp",
            "es-php",
            "es-thinkphp",
        ]
    }
];

const ckeditorComponents = {
    type: 'list',
    message: '安装富文本组件(Ckeditor):',
    name: 'installCkeditor',
    choices: [
        "yes",
        "no"
    ]
};

const nowInstall = {
    type: 'list',
    message: '立即安装依赖:',
    name: 'install',
    choices: [
        "yes",
        "no"
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
    if( result && (result.plugins.includes("es-vue") || result.plugins.includes("es-nuxt"))){
        const vue = await inquirer.prompt([vueVersion]);
        result.vue_version = vue.version;
        const components = await inquirer.prompt([ckeditorComponents]);
        result.installCkeditor = components.installCkeditor==='yes';
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
        console.info( chalk.green( 'Run project: `npm run start`' ) );
    }else{
        tasks.forEach( task=>task(false) );
        console.info( chalk.bgGreen( `\r\nCreate successful!` ) )
        console.info( chalk.green( 'Project path: `cd '+config.project_path+'`' ) );
        console.info( chalk.green( 'Install dependencies: `npm install`' ) );
        console.info( chalk.green( 'Run project: `npm run start`' ) );
    }
});