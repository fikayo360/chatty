const express = require("express")
const router = express.Router()
const {addmessage,getmessages} = require("../controllers/messages")
const {verifyToken} = require("../middlewares/auth")

//message routes
router.route("/add").post(verifyToken,addmessage)
router.route("/:conversationid").get(verifyToken,getmessages)

module.exports = router