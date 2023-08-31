const mongoose = require('mongoose');

const Account = new mongoose.Schema({
    username : {type:String, unique:true, required: true},
    pw : {type:String, required: true},
    nickName : {type:String, required: true},
    regDate: {type:Date, default:Date.now()},
    updateDate:{type:Date, default: Date.now()}
});

Account.statics.create = function(payload) {
    const member = new this(payload);
    return member.save();
};

Account.statics.findAll = function() {
    return this.find({});
};

Account.statics.updateByMember = function(username, payload) {
    return this.findOneAndUpdate({username}, payload);
};

Account.statics.deleteByMember = function(username) {
    return this.deleteOne({username});
}

module.exports = mongoose.model("Member", Account);