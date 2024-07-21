const { getMessages, addMessage } = require("../controllers/messages");

const router=require("express").Router();

router.post('/',getMessages)
router.post('/add',addMessage)

module.exports=router;