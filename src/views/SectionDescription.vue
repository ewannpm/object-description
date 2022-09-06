<template>
    <div class="lefter">
        <h1>段落描述</h1>
        <div class="html-container">
            <pre v-html="html"></pre>
        </div>
    </div>
    
</template>

<script>
import { ref } from 'vue'
import ObjectDescription from '../ObjectDescription.js'

export default {
    setup() {
    const html = ref('123456') 
    
    const str = `
    {
        mode: "development",
        entry: "./src/index.js",
        output:{
            publicPath: "/",
            path: "F:path.resolve(__dirname, 'dist')",
            filename:'bundle.js',
            chunkFilename: "[name]-[hash:5].chunk.js"
        },
        module: {
            rules: [
                {test: /\\.css$/, use:['style-loader', 'css-loader']},
                {test: /\\.scss$/,use: ['style-loader', 'css-loader', 'sass-loader']},
                {test: /\\.(jpg|png|gif)/, loader:'url-loader', options:{limit: 8 * 1024, esModule: false, name: '[hash:10].[ext]'}},
                {test:/\\.html$/, loader:'html-loader'},
                {test: /\\.txt$/, use: 'raw-loader' }
            ]
        },
        plugins:[
            "F:new HtmlWebpackPlugin({template:'./public/index.html'})"
        ],
        devtool: "source-map",
        devServer:{
            contentBase: "F:path.resolve(__dirname, 'dist')",
            compress: true,
            open: true,
            hot: true,
            overlay: true,
            host: 'localhost', //target host
            port: 8080,
            proxy: {
                "/comments": {
                    target: "https://m.weibo.cn",
                    changeOrigin: true,
                    logLevel: "debug",
                    headers: {Cookie: ""}
                },
                // 项目中请求路径为/api的替换为target
                '/api':{
                    target: 'http://192.168.1.30:8085',//代理地址，这里设置的地址会代替axios中设置的baseURL
                    changeOrigin: true, // 是否跨域
                    //ws: true, // proxy websockets
                    //pathRewrite方法重写url
                    pathRewrite: {'^/api': '/'} 
                    //pathRewrite: {'^/api': '/'} 重写之后url为 http://192.168.1.30:8085/xxxx
                    //pathRewrite: {'^/api': '/api'} 重写之后url为 http://192.168.1.30:8085/api/xxxx
                }
            },
            
            
            historyApiFallback: {
                rewrites: [{ from: /.*/, to: "/index.html" }] // HTML5 history模式
            }
        },
        resolve: {
            alias: {
                'src': "F:path.resolve(__dirname, './src')",
                'assets': "F:path.resolve(__dirname, './src/assets')",
                'components': "F:path.resolve(__dirname, './src/components')"
            },
            extensions: ['.js', '.json', '.jsx', '.css'],
            modules: ["F:resolve(__dirname, '../../node_modules')", 'node_modules']
        }
    }`
    
    const objhtml = new ObjectDescription(str, {
        // formatter: {
        //     inline: [
        //         '.module.rules[0]', '.module.rules[0].use', 
        //         '.module.rules[1]', '.module.rules[1].use',
        //         '.module.rules[3]', '.module.rules[4]',
        //         '.resolve.extensions', '.resolve.modules'
        //     ]
        // },
        style: 'color:#ccc',
        nodeMultiple: {
            '.mode': [0, ['development', 'poduction', 'none'], '模式', ['开发', '生产', '无']],
            '.entry': [0, ['./src/index.js', {index:'./src/index.js', login: './src/login.js'}], '入口', ['单', '多/命名']],
            '.output.filename': [0, ['bundle.js', '[name].js', '[name]-[hash].js', '[name]-[hash:5].js'], '输出文件名', ['指定', '入口名', '哈希', '哈希长度']],
            '.devtool': [0, ["source-map"]]
        },
        comment: {
            '.output.path': '绝对路径',
            '.module.rules[2].options.name': '重命名',
            '.devServer.compress': '启动gzip压缩',
            '.devServer.open': '自动打开浏览器',
            '.devServer.hot': '热重载'
        },
        declarator: {
            '.module.rules[2]': 'npm i url-loader file-loader -D',
            '.module.rules[3].loader': '处理html文件的img图片(负责引入img,从而能被url-loader进行处理)',
            '.plugins[0]': 'npm i html-webpack-plugin -D',
            '.devServer': `开发服务器自动化(自动编译,自动打开浏览器,自动刷新浏览器): 热更新\n特点:只会在内存中编译打包,不会有任何输出\n启动指令: webpack-dev-server 你也可以在package.json文件中重新修改指令`,
            '.devServer.overlay': '如果代码出错，会在浏览器页面弹出“浮动层”。类似于 vue-cli 等脚手架',
            '.resolve.extensions': '省略文件路径的后缀名',
            '.resolve.modules': '告诉webpack模块准确位置避免查找'
        },
        presets: [
            {title: '基础配置', options: ['.mode', '.entry', '.output'], style: "color:#36f; font-weight:bold"},
            {title: '分包䇿略', options: [
                {node: '.mode'}, 
                {node: '.entry'}, 
                {node: '.output'}
            ], style: "color:#36f; font-weight:bold"}
        ],
        filter: {
            presets: [],
            options: []
        }
    })
    
    html.value = objhtml.print({
        // styles: [
        //     [['.mode', '.entry', '.output'], "color:#36f; font-weight:bold"]
        // ]
    })
    
    // setTimeout(() => {
    //     html.value = objhtml.print({
    //         styles: [
    //             [['.c[2]', '.b.j'], "color:#00f; font-weight:bold"]
    //         ],
    //         nodeSelector: [
    //             ['.b', 2],
    //             ['.c[4]', 0],
    //             ['.d', 0]
    //         ]
    //     }, true)
    // }, 5000)

    const lightNode = option => {
        const obj = {
            styles: [
                [[option.node], "color:#0b0; font-weight:bold"]
            ],
            nodeSelector: [
                [option.node, option.index]
            ]
        }
        console.log(obj);
        html.value = objhtml.print(obj, true)
    }
    

    return {
        html,
        lightNode
    }
    }
    // 组件的“其余部分”
}
</script>

<style lang="scss">
html, body {
    height: 100%;
    overflow: hidden;
}
.object-description-desc {
    display: inline-block;
    background-color: #333;
    line-height: 1px;
    width: 1px;
    background-color: #f00;
    vertical-align: middle;
    position: relative;
    &::before{
        content: "i";
        position: absolute;
        right: 0;
        top: -7px;
        background-color: #ccc;
        line-height: 14px;
        font-size: 12px;
        color: #fff;
        text-align: center;
        width: 10px;
        height: 14px;
        border-radius: 10px;
        font-family:Courier, monospace;
        cursor: pointer;
        transform: scale(0.8);
    }
}
#app {
    height: 100%;
    display: flex;
    .lefter {
        flex: 1 1 auto;
        overflow-y: scroll;
        .html-container {
            font-size: 12px;
            padding: 0 0 20px 0;
        }
    }
    .righter {
        flex: 0 0 25%;
        overflow-y: scroll;
        padding: 5px;
        background-color: #eee;
        .theme {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            line-height: 20px;
            display: block;
            border-bottom: #ddd 1px solid;
        }
        .theme-container{
            padding: 5px 0 8px;
            font-size: 12px;
            .item {
                padding-bottom: 2px;
                .title, .option {
                    display: inline-block; 
                    line-height: 16px;
                    margin: 1px;
                }
                .title {padding-right: 2px; color: #555;}
                .option {
                    padding: 0 10px;
                    background-color: #fff;
                    color: #999;
                    border-radius: 0 0 5px 0;
                }
            }
            
        }
    }
}
</style>