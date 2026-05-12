import express from 'express'
const app = express()
const PORT = 3000

import { connectDb } from './db/db.js';
import {saveAds} from './services/saveAds.js'
import {findProfileById} from './services/finder.js'
import {checker} from './services/checker.js'
import {scrape} from './services/scraper.js'

import competitorRouter from './routes/competitor.routes.js'
import adRouter from './routes/ad.routes.js'
import monitorRouter from './routes/monitor.routes.js'

app.use(express.json());
app.use('/competitor',competitorRouter)
app.use('/ads',adRouter)
app.use('/monitor',monitorRouter)


connectDb()

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})
