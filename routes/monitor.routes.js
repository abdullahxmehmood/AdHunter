import express from 'express'
import { checker } from '../services/checker.js'
const router = express.Router()

router.get('/:profileId',async(req,res)=>{
    try {
    let profileId = req.params.profileId
    let user =await checker(profileId)
    return res.status(200).json({status:true,user})
    } catch (error) {
    console.log("Error in /monitor/:profileId: ", error)    
    return res.status(500).json({status:false})
    }
})

export default router