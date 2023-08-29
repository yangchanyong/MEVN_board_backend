const mongoose = require('mongoose');

const Account = new mongoose.Schema({
    username : {type:String, unique:true, required: true},
    pw : {type:String, required: true},
    nickName : {type:String, required: true},
    regDate: {type:Date, default:Date.now()},
    updateDate:{type:Date, default: Date.now()}
});

module.exports = mongoose.model("Member", Account);