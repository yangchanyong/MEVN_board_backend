const Member = require('../models/member');

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

module.exports = {seeProfile};