const { clone } = require("./download");

const fs = require('fs')
const handlebars = require('handlebars');
const symbols = require('log-symbols');
const chalk = require('chalk');
const OSS = require('ali-oss');
var path = require('path');



module.exports.create = async name => {
    console.log("创建项目：" + name);
    await clone("github:su37josephxia/vue-template", name);
}

module.exports.refresh = async name => {
    const list = fs.readdirSync("./src/views")
        .filter(v => v !== "Home.vue")
        .map(v => {
            return {
                name: v.replace(".vue", "").toLowerCase(),
                file: v
            }
        })
    // 生成路由定义
    compile({ list }, "./src/router.js", "./template/router.js.hbs")

    // 生成菜单
    compile({ list }, "./src/App.vue", "./template/App.vue.hbs")
}

function compile(meta, filePath, template) {
    if (fs.existsSync(template)) {
        const content = fs.readFileSync(template).toString();
        const result = handlebars.compile(content)(meta);
        fs.writeFileSync(filePath, result);
        console.log(symbols.success, chalk.green(`🔥${filePath} 创建成功`))
    }
}

module.exports.publish = async (filePath) => {
    fileDisplay(filePath);
}

function fileDisplay(filePath) {
    console.log(uploadOss)
    const files = fs.readdirSync(filePath);
    files.forEach(function (filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        const stats = fs.statSync(filedir);
        var isFile = stats.isFile();//是文件
        var isDir = stats.isDirectory();//是文件夹
        if (isFile) {
            // fileList.push(filedir);
            uploadOss(filedir)
        }
        if (isDir) {
            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    });

    function uploadOss(filedir) {
        const client = new OSS({
            region: 'oss-cn-hangzhou',
            accessKeyId: '',
            accessKeySecret: '',
            bucket: 'tongqi'
        });

        // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
        client.put(filedir, filedir).then(function (r1) {
            console.log('put success: %j', r1.url);
            return client.get('bundlejs');
        }).then(function (r2) {
            console.log('get success: %j', r2);
        }).catch(function (err) {
            console.error('error: %j', err);
        });
    }
}
