
import mongoose from "mongoose";

const connectDb = async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/myApp")
        console.log("[*] Mongodb Connected.")
    } catch (error) {
        console.log("Db Error " + error)
        process.exit(1)
    }
}



export {connectDb}