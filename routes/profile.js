const Member = require('../models/member');
const bcrypt = require('bcrypt');

const seeProfile = async (req, res) => {
    const {id} = req;
    const member = await Member.findOne({username: id});
    if(member) {
        return res.status(200).json({member})
    }
    res.status(401).json({
        ok: false,
        message: 'user not exist',
    });
};

const modifyProfile = async (req, res) => {
    try {
        console.log(req.body.nickName);
        await Member.updateOne(
            {username:req.body.username},
            {
                $set: {
                    nickName:req.body.nickName,
                    updateDate:Date.now()
                }
            }
        )
        console.log('통과했니?')
        res.status(200).json({
            ok:true,
            message:'정보 수정 성공!'
        });
    }catch (e) {
        console.log(e)
        res.status(401).json({
            ok:false,
            message: 'user not exist!'
        })
    }
}

const modifyPw = async (req, res) => {
    try {
        await Member.updateOne(
            {username:req.body.username},
            {
                $set:{
                    pw:bcrypt.hashSync(req.body.pw, 10),
                    updateDate:Date.now()
                }
            }
        );
        res.status(200).json({
            ok:true,
            message:'정보 수정 성공!'
        });
    }catch (e) {
        res.status(401).json({
            ok:false,
            message: 'user not exist!!!'
        })
    }
}

module.exports = {seeProfile, modifyProfile, modifyPw};