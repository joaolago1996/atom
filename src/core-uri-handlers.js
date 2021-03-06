function openFile (atom, {query}) {
  const {filename, line, column} = query

  atom.workspace.open(filename, {
    initialLine: parseInt(line || 0, 10),
    initialColumn: parseInt(column || 0, 10),
    searchAllPanes: true
  })
}

function windowShouldOpenFile ({query}) {
  const {filename} = query
  return (win) => win.containsPath(filename)
}

const ROUTER = {
  '/open/file': { handler: openFile, getWindowPredicate: windowShouldOpenFile }
}

module.exports = {
  create (atomEnv) {
    return function coreURIHandler (parsed) {
      const config = ROUTER[parsed.pathname]
      if (config) {
        config.handler(atomEnv, parsed)
      }
    }
  },

  windowPredicate (parsed) {
    const config = ROUTER[parsed.pathname]
    if (config && config.getWindowPredicate) {
      return config.getWindowPredicate(parsed)
    } else {
      return (win) => true
    }
  }
}
