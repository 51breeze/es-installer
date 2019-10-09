#!/usr/bin/env node  
const program = require('commander');
const PATH = require('path');
const fs = require('fs');
const create = require('../index.js');
const inquirer =  require('inquirer');
const extend =  require('extend');
const {spawn} = require('child_process');

program
.version( 'easescript-installer@'+require('../package.json').version )
.option('--init', '初始化项目');

const questions = [
{
    type: 'input',
    message: '项目名:',
    name: 'project_path',
    default: "./project",
    validate:function(val){
        return val ? true : "项目名不能为空";
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
    type: 'input',
    message: '描述:',
    name: 'description',
},
{
    type: 'input',
    message: '作者:',
    name: 'author',
},
{
    type: 'input',
    message: '配置文件路径:',
    name: 'config_path',
},
{
    type: 'input',
    message: '入口文件(file/path):',
    default: "[project_src_dir]",
    name: 'bootstrap',
},
{
    type: 'input',
    message: '皮肤扩展路径(libxmljs):',
    name: 'libxmljs_local_path',
},
{
    type: 'confirm',
    message: '支持皮肤:',
    name: 'skin'
},
{
    type: 'confirm',
    message: '是否拆分打包:',
    name: 'chunk'
},
{
    type: 'confirm',
    message: '是否使用webpack打包:',
    name: 'use_webpack'
},
{
    type: 'list',
    message: '服务端运行环境:',
    name: 'service_provider_syntax',
    choices: [
        "php",
        "node",
    ]
},
{
    type: 'input',
    message: '指定编译参数:',
    name: 'other'
},
{
    type: 'confirm',
    message: '立即安装',
    name: 'installer'
}
];

program.parse( process.argv );
if( program.init )
{
    inquirer.prompt(questions).then(function(answers)
    {
        var config = {};
        var installer = answers.installer;
        var config = create( extend(config, answers) );
        if( installer )
        {
            let child = spawn(process.platform === "win32" ? "npm.cmd" : "npm" , ['install'], {cwd:config.project_path,stdio: 'inherit'});
            child.on("close",function()
            {
                let es = PATH.join(config.project_path,"node_modules/easescript/bin/es.js");
                if( fs.existsSync(es) )
                {
                    let path =`%~dp0${PATH.sep}node_modules${PATH.sep}easescript${PATH.sep}bin${PATH.sep}es.js`;
                    let cmd=`@IF EXIST "%~dp0${PATH.sep}node.exe" (
                    "%~dp0${PATH.sep}node.exe"  "${path}" %*
                    ) ELSE (
                    @SETLOCAL
                    @SET PATHEXT=%PATHEXT:;.JS;=;%
                    node  "${path}" %*
                    )`;
                    fs.writeFileSync( PATH.join(config.project_path, "es.cmd"), cmd.replace(/\t/g,'') );
                }
            });
        }
    });

}else
{
    program.parse(["","","--help"] );
}