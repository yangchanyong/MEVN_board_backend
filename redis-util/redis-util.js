const redisUtil = require('redis');

const redisClient = redisUtil.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    legacyMode: true,
});

redisClient.on('connect', () => {
    console.info('Redis connected!')
})

redisClient.on('error', (err) => {
    console.info('Redis Client Error', err)
});

redisClient.connect().then();
const redisCli = redisClient.v4;

module.exports = {redisClient};