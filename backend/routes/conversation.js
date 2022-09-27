const express = require("express")
const router = express.Router()
const {getconversations} = require("../controllers/conversation")
const {verifyToken} = require("../middlewares/auth")
//auth routes

router.route("/allconvo").get(verifyToken,getconversations)

module.exports = router