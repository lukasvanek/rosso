import express from 'express'
import mongoose from 'mongoose'
import Envs from './models/envs'
import Apps from './models/apps'
import * as R from 'ramda'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 5000

// @ts-ignore
mongoose.connect(process.env.MONGO_URI, {
  bufferMaxEntries: 0,
  keepAlive: true,
  socketTimeoutMS: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(cors())
app.use(bodyParser.json())

app.get('/env/:uid', async (req, res) => {
  const env = await Envs.findOne({ uid: req.params.uid }).lean()
  res.json(env)
})

app.post('/env', async (req, res) => {
  try {
    const env = await Envs.create(req.body)

    res.json(env)
  } catch (err) {
    console.log(err)
  }
})

app.get('/app/:id', async (req, res) => {
  const app = await Apps.findOne({ _id: req.params.id }).lean()
  res.json(app)
})

app.post('/app', async (req, res) => {
  try {
    const _id = req.body._id
    const newApp = R.omit(['_id'], req.body)

    if (_id) {
      await Apps.update({ _id }, newApp)
      return res.json(req.body)
    }

    const a = await Apps.create(newApp)

    res.json(a)
  } catch (err) {
    console.log(err)
  }
})

app.listen(port, () =>
  console.log(`🚀 Server ready at http://localhost:${port}`),
)
