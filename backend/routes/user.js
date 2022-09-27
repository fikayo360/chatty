const express = require("express")
const router = express.Router()
const {signup,login,getusername,addfriend,removefriend,getuserbyid,
    completeprofile,generateconversations,onlineusers,getConversationfriend} = require("../controllers/user")
const {verifyToken} = require("../middlewares/auth")
//auth routes

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/search").post(verifyToken,getusername)
router.route("/online").post(onlineusers)
router.route("/profile").get(verifyToken,getuserbyid)
router.route("/getConversationfriend").post(verifyToken,getConversationfriend)
router.route("/addfriend/:friendid").post(verifyToken,addfriend)
router.route("/removefriend/:friendid").post(verifyToken,removefriend)
router.route("/completeprofile").post(verifyToken,completeprofile)
router.route("/genconversations").post(verifyToken,generateconversations)
module.exports = router