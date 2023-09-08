const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Account = new mongoose.Schema({
    username : {type:String, unique:true, required: true},
    pw : {type:String, required: true},
    nickName : {type:String, required: true},
    regDate: {type:Date, default:Date.now()},
    updateDate:{type:Date, default: Date.now()}
});

// Account.methods.hashPassword = async function() {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.pw = await bcrypt.hash(req.body.pw, 10);
//     }catch (err) {
//         throw err;
//     }
// }

Account.statics.create = async function(payload) {
    const member = new this(payload);
    member.pw = await bcrypt.hash(payload.pw, 10);
    return member.save();
};

Account.statics.findAll = function() {
    return this.find({});
};

Account.statics.findByMember = function(username) {
    return this.findOne({username});
}

Account.statics.updateByMember = function(username, payload) {
    return this.findOneAndUpdate({username}, payload);
};

Account.statics.deleteByMember = function(username) {
    return this.deleteOne({username});
}

module.exports = mongoose.model("Member", Account);