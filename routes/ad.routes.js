import express from 'express'
import Competitor from '../models/competitor.js'
import { scrape } from '../services/scraper.js'
import { saveAds } from '../services/saveAds.js'
import Ads from '../models/ad.js'

const router = express.Router()


// 📄 Get all ads
router.get('/', async (req, res) => {
    try {
        let status = req.query.status;
        let ads;
        if (status) {
            ads = await Ads.find({ status: status })
        } else {
            ads = await Ads.find({})
        }
        return res
            .status(200)
            .json({ status: true, ads })
    } catch (error) {
        console.log("Error in Get /ads: ", error)
        res.status(400).json({ status: false })
    }
})


router.get('/:iid', async (req, res) => {
    try {

        let iid = req.params.iid;
        let ad = await Ads.findOne({ iid })
        return res.status(200).json({ status: true, ad })
    } catch (error) {
console.log("Error in /ads/:iid: ",error);
return res.status(500).json({status:false})

    }
})
export default router

