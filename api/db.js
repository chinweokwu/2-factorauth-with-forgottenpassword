import mongoose from "mongoose";

const db = ()=> {
  mongoose.set('strictQuery', true);
  try {
    mongoose.connect(process.env.DATABASE)
    console.log("Connection to DB was a success")
  }catch(error){
    console.log(error)
    console.log("Could not connect to DB")
  } 
}

export default db;