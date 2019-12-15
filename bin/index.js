#!/usr/bin/env node
const program = require("commander");
const { create, refresh, publish } = require("../lib/api");

program.version(require("../package").version)
console.log(process.argv)
// 创建项目
program
    .command("create <name>")
    .description("create your project")
    .action(name => {
        create(name);
    })
// 刷新自动更新路由
program
    .command('refresh')
    .description('refresh routers...')
    .action(refresh)
// 上传到oss
program
    .command('publish <filePath>')
    .description('upload assets to CDN and git commit && push')
    .action((filePath) => {
        console.log("上传包");
        publish(filePath)
    });

program.parse(process.argv);

