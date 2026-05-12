import {findProfileById} from './finder.js'
import Competitor from '../models/competitor.js'
import Ads from '../models/ad.js'

const saveAds = async (user) =>{
    
    let profile = await findProfileById(user.profileId)
    if(profile){
       console.log("👤 User already exist.") 
       return;
    }
    const { ads, ...seller } = user;
    let savedSeller  = await Competitor.create(seller)
    
    let updatedAds = ads.map(ad=>({
        ...ad,
        seller:savedSeller._id
    }))

    const savedAds = await Ads.insertMany(updatedAds)
    
    savedSeller.ads = savedAds.map(ad => ad._id)

    savedSeller.save()
}

export {saveAds}