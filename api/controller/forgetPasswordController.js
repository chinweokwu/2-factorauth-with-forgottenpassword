import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import Token from "../model/emailTokenModel.js";
import {sendEmail} from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const passwordLink = async (req,res) => {
  try{

    const validate = (data)=> {
      const emailSchema = Joi.object({
        email: Joi.string().email().required().label("Email"),
      });
      return emailSchema.validate(data);
    };
    const {error} = validate(req.body);
    if(error) return res.status(400).send({
      message: error.details[0].message
    })
    let user = await User.findOne({email:req.body.email});
    if(!user) return res.status(409).send({message:"user with email does not exist"})

    let token = await Token.findOne({userId: user._id});

    if(!token){
      token = await new Token({
        userId: user._id,
        token: jwt.sign({ email: user.email, _id: user._id }, process.env.SECRETKEY, { expiresIn: "1h" })
      }).save()
    }
    const url = `http://localhost:3000/${user.id}/${token.token}`
    const subject = "Password Reset";
    const message = `
      <p>Here is a link to reset your password motherfucker </p>
      <p>Click this motherfucking link <a href="${url}">here</a> to reset your fucking password</p>
    `;
    
    await sendEmail(user.email, subject, message);

    res.status(200).send({message:"password reset link is sent to your email account"})
  }catch(error){
    res.status(500).send({message:"Internal server error"})
  }
}

export const verifyUrl = async(req,res) => {
  try {
    const user = await User.findOne({_id: req.params.id})
    if(!user) return res.status(400).send({message: "Invalid link"});

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token
    });
    if(!token) return res.status(400).send({message:"Invalid Link"})
    res.status(200).send({message:"Valid Url"})
  }catch(error){
    res.status(500).send({message:"Internal server error"})
  }
}

export const resetPassword = async(req,res)=> {
  try{
    const validate = (data)=> {
      const passwordSchema = Joi.object({
        password: passwordComplexity().required().label("password"),
      });
      return passwordSchema.validate(data);
    };
    const {error}= validate(req.body);
    if(error) return res.status(400).send({
      message: error.details[0].message
    })
    const user = await User.findOne({_id: req.params.id})
    if(!user) return res.status(400).send({message: "Invalid link"});

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token
    });
    if(!token) return res.status(400).send({message:"Invalid Link"})

    if(!user.verified) user.verified = true;

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    user.password = hashPassword;
    await user.save();
    await token.remove();
    res.status(200).send({message:"password successfully reset"})
  }catch(error){
    res.status(500).send({message:"Internal server error"})
  }
}
