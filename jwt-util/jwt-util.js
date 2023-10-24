const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const redisClient = require('../redis-util/redis-util')
const secret = process.env.JWT_SECRET;

module.exports = {
    sign: (member) => {
        const payload = {
            id:member.username,
            nickName:member.nickName,
        };
        return jwt.sign(payload, secret, {
            algorithm: 'HS256',
            expiresIn: '15s',
        });
    },
    verify: (token) => {
        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
            return {
                ok: true,
                id: decoded.id,
                nickName: decoded.nickName,
            };
        }catch (err) {
            return {
                ok: false,
                message: err.message,
            };
        }
    },
    refresh: () => {
        return jwt.sign({}, secret, {
            algorithm: 'HS256',
            expiresIn: '14d',
        });
    },
    refreshVerify: async (token, username) => {
        const getAsync = promisify(redisClient.redisClient.get).bind(redisClient);

        try {
            const data = await getAsync(username);
            if(token === data) {
                try {
                    jwt.verify(token, secret);

                    return true;
                } catch (err) {
                    return false;
                }

            }else {
                return false;
            }
        } catch (err) {
            return false;
        }
    },
};