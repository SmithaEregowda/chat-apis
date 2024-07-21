const mongoose=require("mongoose")
let Schema=mongoose.Schema;

const MessageSchema=new Schema({
    message:{
        text:{type:String,required:true}
    },
    users:Array,
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }},{
        timestamp:true
    }
)

module.exports=mongoose.model("Messages",MessageSchema)