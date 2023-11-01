const {verify} = require('../jwt-util/jwt-util');
const Member = require('../models/member');
const refresh = require('../jwt-util/refresh')

const authJWT = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ') [1]; // header에서 access token을 가져옵니다.
        const result = verify(token); // token을 검증합니다.
        if (result.ok) { // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
            // const member = await Member.findOne({username: result.id}, {_id:0, pw:0, __v:0})
            // console.log('req.id는 뭐야', result.id)
            // console.log('api 요청한 member의 정보 = ', member)
            // res.status(200).json({member})
            req.id = result.id;
            req.nickName = result.nickName;
            console.log('통과함');
            next();
        } else { // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
            console.log('실패함')
            res.status(401).json({
                ok: false,
                message: result.message, // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
            });
        }
    }
};

module.exports = authJWT;

