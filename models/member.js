const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Account = new mongoose.Schema({
    username : {type:String, unique:true, required: true},
    pw : {type:String, required: true},
    nickName : {type:String, unique: true, required: true},
    regDate: {type:Date, default:Date.now()},
    updateDate:{type:Date, default: Date.now()}
});


Account.statics.create = async function(payload) {
    const member = new this(payload);
    console.log(payload)
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