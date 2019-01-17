import { NodePath } from '@babel/traverse'
import * as bt from '@babel/types'
import * as path from 'path'
import { ComponentDoc } from '../Documentation'
import { parse } from '../main'
import resolvePathFrom from './resolvePathFrom'
import resolveRequired from './resolveRequired'

/**
 * Retruns documentation of the component referenced in the extends property of the component
 * @param {NodePath} astPath
 * @param {Array<NodePath>} componentDefinitions
 * @param {string} originalFilePath
 */
export default function getRequiredExtendsDocumentations(
  astPath: bt.File,
  componentDefinitions: NodePath[],
  originalFilePath: string,
): ComponentDoc | undefined {
  const extendsVariableName = getExtendsVariableName(componentDefinitions)
  // if there is no extends or extends is a direct require
  if (!extendsVariableName) {
    return undefined
  }

  // get all require / import statements
  const extendsFilePath = resolveRequired(astPath, [extendsVariableName])

  const originalDirName = path.dirname(originalFilePath)

  // only look for documentation in the current project
  if (/^\./.test(extendsFilePath[extendsVariableName])) {
    const fullFilePath = resolvePathFrom(extendsFilePath[extendsVariableName], originalDirName)
    return parse(fullFilePath)
  }
}

function getExtendsVariableName(componentDefinitions: NodePath[]) {
  const extendsVariable = componentDefinitions.reduce((acc: NodePath[], compDef) => {
    if (
      bt.isClassDeclaration(compDef.node) &&
      compDef.node.superClass &&
      bt.isIdentifier(compDef.node.superClass)
    ) {
      acc.push(compDef.get('superClass') as NodePath<bt.Identifier>)
    } else {
      const extendsProp = (compDef.get('properties') as Array<NodePath<bt.Property>>).filter(
        (p: NodePath<bt.Property>) => p.node.key.name === 'extends',
      )
      if (extendsProp.length) {
        acc.push(extendsProp[0])
      }
    }
    return acc
  }, [])

  if (extendsVariable.length) {
    const extendedPath = extendsVariable[0]
    const extendsValue = bt.isProperty(extendedPath.node)
      ? extendedPath.node.value
      : extendedPath.node
    return extendsValue && bt.isIdentifier(extendsValue) ? extendsValue.name : undefined
  }
  return undefined
}
