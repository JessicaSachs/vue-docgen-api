import fs from 'fs'
import recast from 'recast'
import parser from './utils/parser'
import babylon from './utils/babylon'
import resolveExportedComponent from './utils/resolveExportedComponent'
import Documentation from './Documentation'
import propHandler from './handlers/propHandler'

const ERROR_MISSING_DEFINITION = 'No suitable component definition found.'

function executeHandlers(handlers, componentDefinitions) {
  return componentDefinitions.map(compDef => {
    var documentation = new Documentation()
    handlers.forEach(handler => handler(documentation, compDef))
    return documentation.toObject()
  })
}

export const parse = function(file) {
  const source = fs.readFileSync(file, {
    encoding: 'utf-8',
  })
  return parseSource(source)
}

export const parseSource = function(source) {
  var time2 = 'parse'
  console.time(time2)
  if (source === '') {
    throw new Error('The document is empty')
  }
  const blocks = parser(source)
  var ast = recast.parse(blocks.script.content, babylon)

  var componentDefinitions = resolveExportedComponent(ast.program, recast)

  if (componentDefinitions.length === 0) {
    throw new Error(ERROR_MISSING_DEFINITION)
  }

  const vueDoc = executeHandlers([propHandler], componentDefinitions)
  console.timeEnd(time2)
  return vueDoc.length ? vueDoc[0] : undefined
}
