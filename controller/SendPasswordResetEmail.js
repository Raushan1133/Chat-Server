const jwt = require("jsonwebtoken");
const  transporter  = require("../config/emailConfig");
const UserModel = require("../models/UserModel")

const sendPasswordResetEmail = async(req,res)=>{
    try {
        const email  = req.body.email
        const user = await UserModel.findOne({email : email});
        if(!user){
            return res.json({
                success:false,
                error:true,
                message:"User not found"
            })
        }

        let userId = user._id;
        let token = jwt.sign({userId : userId},process.env.JWT_SECREAT_KEY, {expiresIn: '15m'} );
        const link = `${process.env.FRONTEND_URL}/api/user/reset-password/${userId}/${token}`
        let info =await transporter.sendMail({
            from : process.env.EMAIL_FROM,
            to:user.email,
            subject:"Raushan's Live Talkera Project - password reset link",
            html : `<a href=${link}>Click here </a> to Reset your password <br> Note:  This link will be expired in 15 minutes.`
        })
        res.json({
            info:info,
            message:"Password reset link sent successfully, Please check your email ...",
            success:true,
            error:false
        })
    } catch (error) {
        res.json({
            success:false,
            error:true,
            message: error.message || error
        })
    }
}

module.exports = sendPasswordResetEmail