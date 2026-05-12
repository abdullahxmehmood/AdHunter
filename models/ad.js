import mongoose from "mongoose";

const adsSchema = new mongoose.Schema({
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"seller"
    },
    title:String,
    price:Number,
    link:String,
    location:String,
    coverPhoto:String,
    creationDate:String,
    profileId:String,
    status: {
    type: String,
    default: "active"
    },
    iid:{
        type:String,
        unique:true
    },
    hash:String
})

const Ads = mongoose.models.ad || mongoose.model("ad", adsSchema);

export default Ads