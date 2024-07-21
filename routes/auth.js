const { signUp, Login, getContacts } = require("../controllers/auth");
const { signupValidator, loginValidator } = require("../middlewares/validation");

const router=require("express").Router();


router.post('/signup',signupValidator,signUp);

router.post('/login',loginValidator,Login)

router.get('/getusers/:userId',getContacts)

module.exports=router;