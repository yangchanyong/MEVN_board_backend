const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const { redisClient } = require('../redis-util/redis-util')
const secret = process.env.JWT_SECRET;

module.exports = {
    sign: (member) => {
        const payload = {
            id:member.username,
            nickName:member.nickName,
        };
        return jwt.sign(payload, secret, {
            algorithm: 'HS256',
            expiresIn: '1h',
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
        console.log('들어오냐?')
        const getAsync = promisify(redisClient.get).bind(redisClient);
        console.log('jwtUtil getAsync = ', getAsync)

        try {
            const data = await getAsync(username);
            // const data = await redisClient.get(username)
            console.log('data = ', data)
            console.log('token = ', token)
            if(token === data) {
                try {
                    jwt.verify(token, secret);
                    console.log('통과됐니?')
                    return true;
                } catch (err) {
                    return {
                        ok: false,
                    };
                }

            }else {
                console.log('이상하네')
                return false;
            }
        } catch (err) {
            console.log('catch로 빠짐')
            return false;
        }
    },
};
