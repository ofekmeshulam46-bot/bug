import express from "express"

import { bugService } from "./services/bug.service.js"
import { loggerService } from "./services/logger.service.js"
import cookieParser from "cookie-parser"

const app = express()
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())

app.get("/api/bug", (req, res) => {
  const filterBy = {
    txt: req.query.txt || "",
    minSeverity: +req.query.minSeverity || 0,
  }
  bugService
    .query(filterBy)
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error("Couldnt get bugs", err)
      res.status(400).send("Had a problem")
    })
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

app.get("/api/bug/:id", (req, res) => {
  const { id: bugId } = req.params
  const visitedIds = req.cookies.visitedIds || []

  console.log(visitedIds)
  if (!visitedIds.includes(bugId)) visitedIds.push(bugId)
  res.cookie("visitedIds", visitedIds)
  console.log(req.params)

  bugService.getById(bugId).then((bug) => res.send(bug))
})

app.get("/api/bug/:id/remove", (req, res) => {
  const { id: bugId } = req.params
  bugService.remove(bugId).then(() => res.send("OK"))
})

const port = 3030
app.listen(port, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`),
)
