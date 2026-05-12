import Competitor from "../models/competitor.js";
import Ads from "../models/ad.js";  // fixed casing too
import { scrape } from "../services/scraper.js";

const checker = async (profileId) => {

    // =========================
    // FIND COMPETITOR
    // =========================
    let competitor = await Competitor.findOne({
        profileId
    });

    // =========================
    // SCRAPE LATEST ADS
    // =========================
    const user = await scrape(profileId);
    if (!user || !user.ads) {
        console.log("Scrape returned empty, aborting.")
        return { success: false, message: "Scrape returned empty" };  // 👈
    }

    // =========================
    // CREATE COMPETITOR IF NOT EXISTS
    // =========================
    if (!competitor) {

        competitor = await Competitor.create({
            name: user.name,
            profileId: user.profileId,
            totalAds: user.totalAds,
            photo: user.photo
        });

        console.log("✅ Competitor saved");
    }

    // =========================
    // FETCH OLD ADS
    // =========================
    const oldAds = await Ads.find({
        seller: competitor._id
    });

    // =========================
    // CREATE LOOKUP MAP + SET
    // =========================
    const oldAdsMap = new Map();

    oldAds.forEach(ad => {
        oldAdsMap.set(ad.iid, ad);
    });

    const freshAdsIds = new Set(
        user.ads.map(ad => ad.iid)
    );

    // =========================
    // RESULT ARRAYS
    // =========================
    const newAdsFound = [];
    const updatedAdsFound = [];
    const removedAdsFound = [];

    // =========================
    // CHECK NEW + UPDATED ADS
    // =========================
    for (const ad of user.ads) {

        const existingAd = oldAdsMap.get(ad.iid);

        if (!existingAd) {

            const savedAd = await Ads.create({
                ...ad,
                seller: competitor._id,
                status: "active"
            });

            newAdsFound.push(savedAd);
            console.log("🆕 New Ad:", ad.title);

        } else if (existingAd.hash !== ad.hash) {

            await Ads.updateOne(
                { iid: ad.iid },
                {
                    $set: {
                        title: ad.title,
                        price: ad.price,
                        location: ad.location,
                        link: ad.link,
                        coverPhoto: ad.coverPhoto,
                        creationDate: ad.creationDate,
                        hash: ad.hash,
                        status: "active"
                    }
                }
            );

            updatedAdsFound.push(ad);
            console.log("✏️ Updated Ad:", ad.title);
        }

    }

    // =========================
    // CHECK REMOVED ADS
    // =========================
    for (const oldAd of oldAds) {

        if (!freshAdsIds.has(oldAd.iid)) {

            await Ads.updateOne(
                { iid: oldAd.iid },
                { $set: { status: "removed" } }
            );

            removedAdsFound.push(oldAd);
            console.log("❌ Removed Ad:", oldAd.title);
        }

    }

    // =========================
    // FINAL RESULT — return everything  👈
    // =========================
    const hasChanges =
        newAdsFound.length > 0 ||
        updatedAdsFound.length > 0 ||
        removedAdsFound.length > 0;

    return {
        success: true,
        hasChanges,
        newAds: newAdsFound,
        updatedAds: updatedAdsFound,
        removedAds: removedAdsFound,
        summary: {
            new: newAdsFound.length,
            updated: updatedAdsFound.length,
            removed: removedAdsFound.length
        }
    };

};


export { checker };