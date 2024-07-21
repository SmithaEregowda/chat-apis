const {validationResult}=require("express-validator")
const bycrypt=require("bcrypt")
const User=require("../models/user");
const jsontoken=require("jsonwebtoken")

exports.signUp=async (req,res,next)=>{
    const errors=validationResult(req);
    try{
        if(!errors.isEmpty()){
                const error = new Error('Validation Failed');
                error.statusCode = 422;
                error.data = errors.array()
                throw error
        }


        //hashing string password to 12
        let password=req.body.password;
        let hashedpassword=await bycrypt.hash(password,12)
        if(!hashedpassword){
            const error=new Error("something wrong with hashing password");
            error.statusCode=422;
            error.data=errors.array();
            throw error;
        }

        const user=new User({
            ...req.body,
            password: hashedpassword
        });

        const result= await user.save();
        if(!result){
            const error = new Error('creatuing user Failed!!')
            throw error;
        }

        res.status(201).json({
            message: 'Created Scucessfully',
            user: result?._id,
            status:200,
        })

    }catch(err){
        next(err)
    }
   
}

exports.Login=async (req,res,next)=>{
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation Failed');
            error.statusCode = 422;
            error.data = errors.array()
            throw error
        }
        const email = req.body.email;
        const password = req.body.password;
        const loggedUser = await User.findOne({ email: email });
        if (!loggedUser) {
            const error = new Error('Invalid credentials');
            error.statusCode = 400;
            throw error
        }
        const isPasswordMatched = await bycrypt.compare(password, loggedUser.password)
        if (!isPasswordMatched) {
            const error = new Error('Invalid Password');
            error.statusCode = 400;
            throw error
        }
        const token = jsontoken.sign({
            email: loggedUser.email,
            userId: loggedUser._id.toString()
        },
            'chatapp',
            { expiresIn: '48hr' }
        )
        res.status(200).json({
            message: "Logged in successfully",
            token: token,
            user: loggedUser?._id,
            status:200
        })

    } catch (err) {
        next(err)
    }
}

exports.getContacts=async (req,res,next)=>{
    const errors=validationResult(req);
    try{
        if(!errors.isEmpty()){
            const error = new Error('Validation Failed');
            error.statusCode = 422;
            error.data = errors.array()
            throw error
        }
        const users=await User.find({_id:{$ne:req.params.userId}});
        
        if(!users){
            res.status(400).json({
                msg:"users not found"
            })
        }

        res.status(200).json({
            users:users
        })

    }catch(err){
        next(err)
    }
}