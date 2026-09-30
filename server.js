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

app.get("/api/bug/:id", (req, res) => {
  const { id: bugId } = req.params
  const visitedIds = req.cookies.visitedIds || []
  if (!visitedIds.includes(bugId)) {
    if (visitedIds.length === 3) {
      console.log('reached limit, wait')
      return res.status(401).send("wait 7 seconds")
    } else {
      visitedIds.push(bugId)
      console.log(visitedIds)
    }
  }
  res.cookie("visitedIds", visitedIds, { maxAge: 1000 * 7 })

  bugService.getById(bugId).then((bug) => res.send(bug))
})

app.post("/api/bug", (req, res) => {
  const bug = {
    title: req.body.title,
    description: req.body.description,
    severity: req.body.severity,
    createdAt: req.body.createdAt,
  }
  bugService.save(bug).then((savedbug) => res.send(savedbug))
})

app.put("/api/bug/:id", (req, res) => {
  const bug = {
    _id: req.body._id,
    title: req.body.title,
    description: req.body.description,
    severity: req.body.severity,
    createdAt: req.body.createdAt,
  }
  bugService.save(bug).then((savedbug) => res.send(savedbug))
})

app.delete("/api/bug/:id", (req, res) => {
  const { id: bugId } = req.params
  bugService.remove(bugId).then(() => res.send("OK"))
})

const port = 3030
app.listen(port, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`),
)
