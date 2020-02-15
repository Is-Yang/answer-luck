module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: {
            '/': {
                // target: 'http://gtmcmp.signalfire.net.cn',
                target: 'http://gfwp.gac-toyota.com.cn',
                changeOrigin: true,
                ws: false
            }
        },
        overlay: {
            warnings: false,
            errors: false
        }
    },
    lintOnSave: false,
}