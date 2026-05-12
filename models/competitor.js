import mongoose from "mongoose";

const CompetitorSchema = new mongoose.Schema({
    name:String,
    profileId:{
        type:String,
        unique:true
    },
    totalAds:String,
    photo:String,
    ads:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ad"
    }]
})


const Competitor = mongoose.model("seller",CompetitorSchema)

export default Competitor