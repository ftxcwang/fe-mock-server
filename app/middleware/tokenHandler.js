'use strict';

module.exports = (options) => {
    return async function (ctx, next) {
        const token = ctx.request.header.authorization;
        let decode = '';
        if (token) {
            try {
                // 解码token
                decode = ctx.app.jwt.verify(token, options.secret);//验证token
                // 获取用户信息
                ctx.decode = decode;
            } catch (error) {
                ctx.status = 401;
                ctx.body = {
                    code: 401,
                    msg: error.message,
                    data: ''
                };
                return;
            }
            //切记先解析token并存储数据后再执行回调，否则解析数据获取不到x
            await next();
        } else {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                msg: '没有token',
                data: ''
            };
            return;
        }
    };
};
