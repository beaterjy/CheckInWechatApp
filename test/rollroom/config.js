'use strict';
//Author: Yang dragon2tech@163.com

let config = {
	mysql: {
		host: 'localhost',
		port: '3306',
		user: 'root',
		password: 'zbj',
        database: 'wx-rollroom',

	},

    redis: {
        host: '192.168.1.123',
        port: '6379'
    },

    qrcode: {
        version: 5,
        errorCorrectionLevel: 'M',
        margin: 2,
    },

    QRCode_DIR: 'abcd',

    server_url: 'http://localhost:3000',

	AppID: 'wx671e5bcbb5310db2',
    AppSecret: '4ac1cc5a4153f7cae414e343a2a4a4b5',

    privateKey: 'server.key',
    certificate: 'server.crt',

    secret_code: '9jaHs76:c234as.zaw',

    codeToSession_key: 'https://api.weixin.qq.com/sns/jscode2session'
};

if (process.env.NODE_ENV == 'production') {
    console.log('production');
    config = {
        mysql: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: 'zbj',
            database: 'wx-rollroom',
        },

        redis: {
            host: 'localhost',
            port: '6379'
        },

        qrcode: {
            version: 5,
            errorCorrectionLevel: 'M',
            margin: 2,
        },

        QRCode_DIR: 'abcd',
        
        server_url: 'http://www.abcd.com:3000',

        AppID: 'wx671e5bcbb5310db2',
        AppSecret: '4ac1cc5a4153f7cae414e343a2a4a4b5',

        privateKey: 'myprivate.key',
        certificate: 'myprivate.crt',

        secret_code: '9jaHs76:c234as.zaw',

        codeToSession_key: 'https://api.weixin.qq.com/sns/jscode2session'
    }
}

module.exports = config;