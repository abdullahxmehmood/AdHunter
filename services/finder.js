import Competitor from "../models/competitor.js"


const findProfileById = async(Id)=>{
    let profile = await Competitor.findOne({profileId:Id})
    .populate("ads")
    return profile
}

export {findProfileById}