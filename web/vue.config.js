const path = require('path');
const fs = require('fs')
// 引入 移动端模拟开发者工具 插件 （另：https://github.com/liriliri/eruda）
const vConsolePlugin = require('vconsole-webpack-plugin');
// Gzip
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // Webpack包文件分析器
const FileManagerPlugin = require("filemanager-webpack-plugin");

var isProduction = process.env.NODE_ENV === "production"
module.exports = {
    // vue-cli3.3+ 新版本使用    font\css资源路径
    publicPath: "/",
    //输出文件目录
    outputDir: isProduction ? '../resources/templates' : 'dist',
    // 入口页路径，相对于outputDir路径
    indexPath: 'index.html',
    //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: 'static',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // 是否对文件名附带hash值
    filenameHashing: !isProduction,
    //以多页模式构建应用程序。
    pages: undefined,
    //是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,
    //是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
    parallel: require('os').cpus().length > 1,
    //生产环境是否生成 sourceMap 文件，一般情况不建议打开
    productionSourceMap: false,

    // webpack配置
    /**
     * Vue CLI 内部的 webpack 配置是通过 webpack-chain 维护的。
     * 这个库提供了一个 webpack 原始配置的上层抽象，使其可以定义具名的 loader 规则和具名插件，
     * 并有机会在后期进入这些规则并对它们的选项进行修改。
     * 它允许我们更细粒度的控制其内部配置
     * @param config
     */
    chainWebpack: config => {
        /**
         * 删除懒加载模块的prefetch，降低带宽压力
         * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
         * 而且预渲染时生成的prefetch标签是modern版本的，低版本浏览器是不需要的
         */
        //config.plugins.delete('prefetch');
        //if(process.env.NODE_ENV === 'production') { // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
        //} else {// 为开发环境修改配置...
        //}
        /*if (isProduction) {
            config.plugin('html').tap(args => {
                // args[0].template = '../resources/templates/index.html'
                // args[0].scrollBarCss = '/static/css/scrollBar.css'
                return args
            })
        } else {
            config.plugin('html').tap(args => {
                args[0].template = './public/index.html'
                // args[0].scrollBarCss = 'dist/static/css/scrollBar.css'
                return args
            })
        }*/
    },
    //调整 webpack 配置 https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
    configureWebpack: config => {
        //生产and测试环境
        let pluginsPro = [
            // new CompressionPlugin({ //文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-webpack-plugin)
            //     filename: '[path].gz[query]',
            //     algorithm: 'gzip',
            //     test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
            //     threshold: 8192,
            //     minRatio: 0.8,
            // }),
            // //	Webpack包文件分析器(https://github.com/webpack-contrib/webpack-bundle-analyzer)
            // new BundleAnalyzerPlugin({
            //     analyzerMode: 'disabled',   // 不启动展示打包报告的http服务器
            //     generateStatsFile: true     // 是否生成stats.json文件
            // })
        ];
        //开发环境
        let pluginsDev = [
            //移动端模拟开发者工具(https://github.com/diamont1001/vconsole-webpack-plugin  https://github.com/Tencent/vConsole)
            /*new vConsolePlugin({
                filter: [], // 需要过滤的入口文件
                enable: true // 发布代码前记得改回 false
            })*/
        ];
        if (isProduction) { // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
            const tempPath = config.output.path;
            const staticPath = path.join(tempPath, './static');
            const staticTargetPath = path.join(tempPath, "../static/");
            if (!fs.existsSync(staticTargetPath)) {
                fs.mkdirSync(staticTargetPath, {recursive: true});
            }
            config.plugins = [...config.plugins, ...pluginsPro, new FileManagerPlugin({
                onEnd: [
                    {delete: [staticTargetPath]},
                    {
                        copy: [{
                            source: staticPath,
                            destination: staticTargetPath
                        }]
                    },
                    {delete: [staticPath]}
                ]
            })]
            //config.plugins = [...config.plugins, ...pluginsPro];
        } else {
            // 为开发环境修改配置...
            config.plugins = [...config.plugins, ...pluginsDev];
        }
    },
    css: {
        // 启用 CSS modules     为true时，允许 import './confirm.css' 引入css。当该模块运行时，将被解析为 <style> 标签并插入到 html 文件的 <head> 中
        requireModuleExtension: true,
        // 是否使用css分离插件
        extract: true,
        // 开启 CSS source maps，一般不建议开启
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            /*scss: {
                //设置css中引用文件的路径，引入通用使用的scss文件（如包含的@mixin）
                data: `
				$baseUrl: "/";
				@import '@/assets/scss/_common.scss';
				`
            }*/
            postcss: {
                plugins: [
                    require("autoprefixer")({
                        // 配置使用 autoprefixer
                        overrideBrowserslist: ["last 15 versions"],

                    }),
                    /*require("postcss-pxtorem")({
                        rootValue: 75, // 换算的基数
                        // 忽略转换正则匹配项。插件会转化所有的样式的px。比如引入了三方UI，也会被转化。目前我使用 selectorBlackList字段，来过滤
                        //如果个别地方不想转化px。可以简单的使用大写的 PX 或 Px 。
                        selectorBlackList: ["ig"],
                        propList: ["*"],
                        exclude: /node_modules/
                    })*/
                ]
            }

        },

    },
    // webpack-dev-server 相关配置 https://webpack.js.org/configuration/dev-server/
    devServer: {
        host: "localhost",
        port: 9090, // 端口号
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        hotOnly: true, // 热更新
        proxy: {
            "": {
                proxyRoot: true,
                // target: "http://dev-fapp.oa.com/",
                target: "http://localhost:80",
                // pathRewrite: { '^/api': '' },
                changeOrigin: true, //是否跨域
                secure: false
                // ws: true,        // websocket支持
            }
        }
    },

    // 第三方插件配置 https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader
    pluginOptions: {
        //https://github.com/yenshih/style-resources-loader
        /*
        'style-resources-loader': {
            // One of: sass, scss, stylus, less
            preProcessor: 'scss',
            // Path to the resources you would like to inject
            patterns: [
                //path.resolve(__dirname, './src/assets/scss/_common.scss'),
            ]
        }*/
    }
};
