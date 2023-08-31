const mongoose = require('mongoose');
const Account = new mongoose.Schema({
    title : {type:String, unique:true, required: true},
    content : {type:String, required: true},
    writer : {type:String, required: true},
    regDate: {type:Date, default:Date.now()},
    updateDate:{type:Date, default: Date.now()}
})

module.exports = mongoose.model("Board", Account);