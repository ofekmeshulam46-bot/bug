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

function save(bugToSave) {
  if (bugToSave._id) {
    const idx = bugs.findIndex((bug) => bug._id === bugToSave._id)
    bugs.splice(idx, 1, bugToSave)
  } else {
    bugToSave._id = utilService.makeId()
    bugs.push(bugToSave)
  }

  return _savebugs().then(() => bugToSave)
}

function _savebugs() {
  return utilService.writeJsonFile(path, bugs)
}
