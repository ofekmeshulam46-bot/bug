import express from "express"

import { bugService } from "./services/bug.service.js"

const app = express()
app.use(express.static("public"))

app.get("/", (req, res) => res.send("Hi there"))

app.get("/api/bug", (req, res) => {
  bugService.query().then((bugs) => res.send(bugs))
})

app.get("/api/bug/save", (req, res) => {
  const { id: _id, title, description, severity, createdAt } = req.query
  const bugToSave = {
    _id,
    title,
    description,
    severity: +severity,
    createdAt: +createdAt,
  }
  console.log(req.query)
  bugService.save(bugToSave).then((savedbug) => res.send(savedbug))
})


app.get('/api/bug/:id', (req, res) => {
    const { id: bugId } = req.params

      console.log(req.params)

	bugService.getById(bugId)
        .then(bug => res.send(bug))
})
///*************/ doesnt show^^

app.get('/api/bug/:id/remove', (req, res) => {
    const { id: bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('OK'))
})




app.listen(3030, () => console.log("Server ready at port 3030"))
