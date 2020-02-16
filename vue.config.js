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
    lintOnSave: false,
    // publicPath: "./",
}