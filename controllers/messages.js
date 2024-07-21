const { validationResult } = require("express-validator");
const Messages = require("../models/messages");


exports.addMessage=async(req,res,next)=>{
    try{
        const errors=validationResult(req)
        if(!errors.isEmpty){
            const error=new Error();
            error.statusCode=422;
            error.message=errors.array();
            throw error;
        }
        const {from ,to ,message}=req.body;

        const createmsg=new Messages({
            message:{text:message},
            users:[from,to],
            sender:from
        })
        const newmsg=await createmsg.save();

        if(!newmsg){
            res.status(400).json({
                message:"Not able to add Message"
            })
        }

        res.status(201).json({
            message:"Message added Succesfully"
        })

    }catch(err){
        next(err)
    }
}

exports.getMessages=async(req,res,next)=>{
    try{
        const errors=validationResult(req)
        const {from,to}=req.body;

        if(!errors.isEmpty){
            const error=new Error();
            error.statusCode=422;
            error.message=errors.array();
            throw error;
        }

        const messages=await Messages.find({
            users:{
                $all:[from,to]
            }
        });

        if(!messages){
            res.status(400).json({
                message:"Not able to get Messages"
            })
        }

        res.status(200).json({
           messages
        })


    }catch(err){
        next(err)
    }
}