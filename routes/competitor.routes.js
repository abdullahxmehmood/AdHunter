import express from 'express'
import Competitor from '../models/competitor.js'
import { scrape } from '../services/scraper.js'
import { saveAds } from '../services/saveAds.js'
import Ads from '../models/ad.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let competitors = await Competitor.find({}).populate("ads")

        return res.json({ status: true, competitors })
    } catch (error) {
        console.log("Error occur: ", error)
        return res.json({ status: false })
    }
})


router.get('/:profileId', async (req, res) => {
    try {
        let profileId = req.params.profileId

        let competitors = await Competitor.findOne({ profileId }).populate("ads")


        return res.json({ status: true, competitors })
    } catch (error) {
        console.log("Error occur: ", error)
        return res.json({ status: false })
    }
})


router.delete('/:profileId', async (req, res) => {
    try {
        let profileId = req.params.profileId
        let profile = await Competitor.findOne({ profileId })
        if (!profile) {
            return res.json({ status: false, message: "user does not exist." })
        }
        let competitors = await Competitor.deleteOne({ profileId })
        let ads = await Ads.deleteMany({ seller: profile._id })
        return res.json({ status: true, competitors, ads })
    } catch (error) {
        console.log("Error occur: ", error)
        return res.json({ status: false })
    }
})

router.post('/', async (req, res) => {
    try {
        let profileId = req.body.profileId;
        let user = await Competitor.findOne({ profileId }).populate("ads")
        if (!user) {

            user = await scrape(profileId)
            let saveAd = await saveAds(user)
            return res.json({ status: true, user: user })

        } else {
            console.log("user already exist");
            return res.json({ status: true, user: user })

        }

    } catch (error) {
        console.log("Error occur: ", error)
        return res.json({ status: false })
    }
})

router.get('/:profileId/ads', async (req, res) => {
    try {
        let profileId = req.params.profileId;
        let user = await Competitor.findOne({ profileId }).populate("ads")
        let ads = user.ads;
        return res.status(200).json({ status: true, ads })
    } catch (error) {
        console.log("Error in /:profileId/ads: ", error);
        return res.status(500).json({ status: false })

    }

})



export default router