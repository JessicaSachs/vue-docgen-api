import recast from 'recast'
import { utils } from 'react-docgen'

const { resolveToValue } = utils

const {
  types: { namedTypes: _types },
} = recast

export default function resolveExportDeclaration(path, types = _types) {
  const definitions = []
  if (path.node.default) {
    definitions.push(path.get('declaration'))
  } else if (path.node.declaration) {
    if (types.VariableDeclaration.check(path.node.declaration)) {
      path.get('declaration', 'declarations').each(declarator => definitions.push(declarator))
    } else {
      definitions.push(path.get('declaration'))
    }
  } else if (path.node.specifiers) {
    path
      .get('specifiers')
      .each(specifier =>
        definitions.push(specifier.node.id ? specifier.get('id') : specifier.get('local'))
      )
  }
  return definitions.map(definition => resolveToValue(definition))
}