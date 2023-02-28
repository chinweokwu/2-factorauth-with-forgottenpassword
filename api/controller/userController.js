import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import Token from "../model/emailTokenModel.js";
import {sendEmail} from "../utils/sendEmail.js";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // ============= validate register data =================
    const validate = (data)=> {
      const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("password")
      });
      return schema.validate(data);
    };

    // ============= send error message if validation fails =================
    const {error}= validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});

    // ============= check if users have already been registered before =================
   
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(409).send({message:"User with given email already exist"})
    
    // ============= hash password =================
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    user = await new User({...req.body, password: hashPassword}).save();
    // ============= generate token =================
    const token = await new Token({
      userId: user._id,
      token: jwt.sign({ email: user.email, _id: user._id }, process.env.SECRETKEY, { expiresIn: "1h" })
    }).save();

    const url = `http://localhost:3000/${user.id}/verify/${token.token}`
    
    const subject = " Please Verify Email";
    const message = `
      <h3>Hello ${user.firstName} ${user.lastName}</h3>
      <p>Thanks yor for registering for our services. motherfucker </p>
      <p>Click this motherfucking link <a href="${url}">here</a> to verify your fucking email</p>
    `;
    // ================= send email =================
    await sendEmail(user.email, subject, message);
    res.status(201).send({message: "An Email sent to your account please"});
  }catch (error){
    console.log(error)
    res.status(500).send({message: "Internally Server Error"})
  };
};


export const login = async (req, res) => {
  try {

    const validate = (data)=> {
      const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("password")
      });
      return schema.validate(data);
    };

    const {error}= validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});
    
    const user = await User.findOne({email: req.body.email});

    if(!user) return res.status(401).send({message:"Invalid Email or Password"});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    if(!validPassword) return res.status(401).send({message:"Invalid Email or Password"});

    if(!user.verified){
      return res.status(403).send({ message: "Verify your Account." });
    };
    const token = jwt.sign({ email: user.email, _id: user._id }, process.env.SECRETKEY, { expiresIn: "1h" });
    res.status(200).send({data: token, message:"user was successfully logged in"});
  } catch(error){
    res.status(500).send({message: "Internally Server Error"})
  }
}

export const emailLink = async(req, res)=> {
  try{
    const user = await User.findOne({_id: req.params.id});
    if(!user) return res.status(400).send({message:"Invalid Link"});

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token
    });
    if(!token) return res.status(400).send({message: "inValid Link"});
    await User.updateOne({_id: user._id}, {verified: true});
    await token.remove();

    res.status(200).send({message: "Email Verified successfully"})
  }catch(error){
    res.status(500).send({message: "Internally Server Error"});
  }
}
