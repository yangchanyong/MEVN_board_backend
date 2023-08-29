const express = require('express');
const Member = require('../../model/member');
const router = express.Router();

router.post(
    "/",
    async (req, res) => {
        const { username, pw, nickName } = req.body;
        try {
            let member = await Member.findOne({username});
            if(member) {
                return res.status(400).json({errors: [{msg: "Member already exists"}]});
            }
            member = new Member({
                username,
                pw,
                nickName,
            });
            await member.save();

        }catch (error) {
            console.log(error.message);
            res.status(500).send('server error');
        }
    }
);
module.exports = router;