import 'babel-polyfill'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import routes from './src/routes'
import ws from './src/services/ws'

dotenv.config()

export const app = express()
const server = http.createServer(app)
const io = ws(server)

app.set('io', io)
app.set('server', server)

app.use(cors())
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use('/', routes)

app.get('server').listen(process.env.PORT, () => {
  console.log(`App listening to ${process.env.PORT}...`)
  console.log('Press Ctrl+C to quit')
})
