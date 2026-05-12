import * as cheerio from 'cheerio'
import axios, { create } from 'axios'
import { sha256 } from 'js-sha256';
import {convertSouthAsianPrice,parseRelativeDate} from '../utilities/utils.js'
import { saveAds } from './saveAds.js';

const HEADERS = {
    Host: 'www.olx.com.pk',
    Connection: 'keep-alive',
    'sec-ch-ua': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.9',
  }

async function scrape(userId) {
    try {
        let profileLink = `https://www.olx.com.pk/profile/${userId}`

        let {data} = await axios.get(profileLink,{
            headers:HEADERS
        })

        let $ = cheerio.load(data)

        const seller = $('div[aria-label="Seller name"]').text().trim();
        const totalAds = $('div._11cf7721 span').text().trim();
        let photo = $('img[aria-label="User photo"]').attr('src');
        if(photo == undefined){
            photo = $('img[aria-label="User photo"]').attr('data-src');
        }else{
            photo = 'www.olx.com.pk'+photo
        }
        let profileId = profileLink.split("/profile/")[1];
        let ads = []

        const user = {
            name:seller,
            profileId,
            totalAds:totalAds,
            photo:photo,
            ads:ads
        }
        $('li[aria-label="Listing"]').each((index, element) => {
            const ad = $(element); // Wrap the element so we can use Cheerio methods


            const title = ad.find('p').text().trim();
            const price = convertSouthAsianPrice(ad.find('div[aria-label="Price"] span').text().trim())
            const link = ad.find('a[href^="/item/"]').attr('href');
            const location = ad.find('span[aria-label="Location"]').text().trim();
            const coverPhoto = ad.find('img[aria-label="Cover photo"]').attr('src')
            const creationDate = parseRelativeDate(ad.find('span[aria-label="Creation date"]').text().trim())
            const match = link.match(/iid-(\d+)/);
            let iid;
            if (match) {
               iid = match[1];
            }
            
            ads.push({
                seller,
                title,
                price,
                link: link ? `www.olx.com.pk${link}` : null, // Handle relative URLs
                location,
                coverPhoto,
                profileId,
                creationDate,
                iid,
                hash: sha256(title + price + location)
            });
        });

        // console.log(`✅ Data scraped.`)
        // console.log(user)
        return user;
        
    } catch (error) {
        console.log(`Error scraping ${error}`)
        throw error
    }
    
}
// // userId = 80248829-6aef-4f0a-8b14-dc741c397f31
// let user = await scrape("80248829-6aef-4f0a-8b14-dc741c397f31")
// await saveAds(user)
// console.log(user)

export {scrape}