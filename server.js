import express from "express"

import { bugService } from './services/bug.service.js'

const app = express()
app.use(express.static('public'))

app.get("/", (req, res) => res.send("Hi there"))

app.get("/api/bug", (req, res) => {
  bugService.query().then((bugs) => res.send(bugs))
})

// app.get('/puki', (req,res)=>{
//     res.send('Hello Puki')
// })

app.listen(3030, () => console.log("Server ready at port 3030"))
