const { body, check } = require("express-validator");
const User=require('../models/user')

exports.signupValidator=[[ 
    body('password').trim().not().isEmpty().withMessage('password is required'),
    body('name').trim().not().isEmpty().withMessage('name is required'),
    body('email').isEmail().custom((value,{req})=>{
        return User.findOne({email:value})
        .then(userDoc=>{
            if(userDoc){
                return Promise.reject('User Alerady Exists')
            }
        })
    }),
    check('cnfpassword').trim().not().isEmpty().withMessage('confirm password is required')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation is incorrect');
        }else{
            return true
        }
      })
]]

exports.loginValidator=[[
    body('password').trim().not().isEmpty().withMessage("password is required"),
    body('email').trim().not().isEmpty().withMessage("email is required")
]]