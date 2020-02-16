module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: {
            '/': {
                // target: 'http://gtmcmp.signalfire.net.cn',
                target: 'http://gfwp.gac-toyota.com.cn',
                changeOrigin: true
            }
        },
        overlay: {
            warnings: false,
            errors: false
        }
    },
    // 关闭eslint
    lintOnSave: false,
    // 静态资源访问路径
    publicPath: "http://gtmccdn.istarcore.com/GTMCfamily/camp/antincp",
    chainWebpack: config => {
        // 清除css，js版本号
        config.output.filename('js/[name].js').end();
        config.output.chunkFilename('js/[name].js').end();
        // 为生产环境修改配置...
        config.plugin('extract-css').tap(args => [{
            filename: `css/[name].css`,
            chunkFilename: `css/[name].css`
        }])
    },
}