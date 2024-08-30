const UserModel = require("../models/UserModel");
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')

const resetPassword = async(req,res)=>{
    try {
        const { id , token , password } = req.body;

        jwt.verify(token,process.env.JWT_SECREAT_KEY, async(error,decoded)=>{
            if(error){
              return res.json({
                    message : "Link expired",
                    success:false,
                    error:true
                })
            }else{
                const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hashSync(password, salt);
        const updatedUserPassword = await UserModel.findByIdAndUpdate(id,{
            $set:{
                password : hashedPassword
            }
        })
        
        res.json({
            success: true,
            error:false,
            message : "Password reset successful"
        })
            }
        })
        
    } catch (error) {
        res.json({
            message : error.message || error,
            success:false,
            error:true
        })
    }
}

module.exports = resetPassword
