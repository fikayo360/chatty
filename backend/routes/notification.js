const express = require("express")
const router = express.Router()
const {addnotification,getnotification} = require("../controllers/notification")
const {verifyToken} = require("../middlewares/auth")

router.route("/add").post(verifyToken,addnotification)
router.route("/all/:id").get(verifyToken,getnotification)

module.exports = router