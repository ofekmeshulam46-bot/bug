import { utilService } from "./util.service.js"

export const bugService = {
  query,
  getById,
  remove,
  save,
}
const path = "./data/bug.json"
const bugs = utilService.readJsonFile(path)

function query(filterBy = {}) {
  let filteredBugs = [...bugs]
  if (filterBy.txt) {
    const regExp = new RegExp(filterBy.txt, "i")
    filteredBugs = filteredBugs.filter((bug) => regExp.test(bug.title))
  }

  if (filterBy.minSeverity) {
    filteredBugs = filteredBugs.filter(
      (bug) => bug.severity >= filterBy.minSeverity,
    )
  }

  return Promise.resolve(filteredBugs)
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId)
  return Promise.resolve(bug)
}

function remove(bugId) {
  const idx = bugs.findIndex((bug) => bug._id === bugId)
  bugs.splice(idx, 1)
  return _savebugs()
}

function save(bug) {
  if (bug._id) {
    const idx = bugs.findIndex((bug) => bug._id === bug._id)
    if (idx === -1) return Promise.reject("Bug not found")
    bugs[idx] = { ...bugs[idx], ...bug }
  } else {
    bug._id = utilService.makeId()
    bugs.push(bug)
  }

  return _savebugs().then(() => bug)
}

function _savebugs() {
  return utilService.writeJsonFile(path, bugs)
}
