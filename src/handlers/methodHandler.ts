import { namedTypes as types, NodePath } from 'ast-types';
import getDocblock from '../utils/getDocblock';
import getDoclets, { DocBlockTags, ParamTag, Tag, Param, ParamType } from '../utils/getDoclets';
import transformTagsIntoObject from '../utils/transformTagsIntoObject';
import { Documentation, MethodDescriptor } from 'src/Documentation';
import {
  isProperty,
  Property,
  isFunctionExpression,
  Identifier,
  isTSTypeAnnotation,
  TSType,
  isTSTypeReference,
  isIdentifier,
} from '@babel/types';
import { BlockTag } from 'src/utils/blockTags';

export default function methodHandler(documentation: Documentation, path: NodePath) {
  const methodsPath = path
    .get('properties')
    .filter((propertyPath) => isProperty(propertyPath.node))
    .filter((p: NodePath<Property>) => p.node.key.name === 'methods');

  const methods: MethodDescriptor[] = [];

  // if no method return
  if (!methodsPath.length) {
    documentation.set('methods', methods);
    return;
  }

  const methodsObject = methodsPath[0].get('value');

  methodsObject
    .get('properties')
    .filter((propertyPath) => isProperty(propertyPath.node))
    .forEach((method: NodePath<Property>) => {
      const methodDescriptor: MethodDescriptor = { name: '', description: '' };

      methodDescriptor.name = method.node.key.name;

      const docBlock = getDocblock(method);

      const jsDoc: DocBlockTags = docBlock ? getDoclets(docBlock) : { description: '', tags: [] };
      const jsDocTags: BlockTag[] = jsDoc.tags ? jsDoc.tags : [];

      if (!jsDocTags.find((t) => t.title === 'public')) {
        return;
      }

      // params
      describeParams(method, methodDescriptor, jsDocTags.filter((tag) => tag.title === 'param'));

      // description
      if (jsDoc.description) {
        methodDescriptor.description = jsDoc.description;
      }

      // returns
      const tagReturns = jsDocTags.find((t) => t.title === 'returns');
      if (tagReturns) {
        methodDescriptor.returns = tagReturns;
      }

      // tags
      methodDescriptor.tags = transformTagsIntoObject(jsDocTags);

      methods.push(methodDescriptor);
    });
  documentation.set('methods', methods);
}

function describeParams(
  methodPath: NodePath<Property>,
  methodDescriptor: MethodDescriptor,
  jsDocParamTags: ParamTag[],
) {
  // if there is no parameter non need to parse them
  const fExp = methodPath.node.value;
  if (fExp && isFunctionExpression(fExp) && !fExp.params.length) {
    return;
  }
  const params: Param[] = [];
  if (fExp && isFunctionExpression(fExp)) {
    fExp.params.forEach((par: Identifier, i) => {
      const param: Param = { name: par.name };

      let jsDocTag = jsDocParamTags.find((tag) => tag.name === param.name);

      // if tag is not namely described try finding it by its order
      if (!jsDocTag) {
        if (jsDocParamTags[i] && !jsDocParamTags[i].name) {
          jsDocTag = jsDocParamTags[i];
        }
      }

      if (jsDocTag) {
        if (jsDocTag.type) {
          param.type = jsDocTag.type;
        }
        if (jsDocTag.description) {
          param.description = jsDocTag.description;
        }
      }

      if (!param.type && par.typeAnnotation) {
        const tsType = isTSTypeAnnotation(par.typeAnnotation)
          ? par.typeAnnotation.typeAnnotation
          : undefined;
        if (tsType) {
          param.type = getTypeObjectFromTSType(tsType);
        }
      }

      params.push(param);
    });
  }

  if (params.length) {
    methodDescriptor.params = params;
  }
}

function getTypeObjectFromTSType(type: TSType): ParamType {
  const typeNameMap: { [name: string]: string } = {
    TSAnyKeyword: 'any',
    TSUnknownKeyword: 'unknown',
    TSNumberKeyword: 'number',
    TSObjectKeyword: 'object',
    TSBooleanKeyword: 'boolean',
    TSStringKeyword: 'string',
    TSSymbolKeyword: 'symbol',
    TSVoidKeyword: 'void',
    TSUndefinedKeyword: 'undefined',
    TSNullKeyword: 'null',
    TSNeverKeyword: 'never',
  };

  const name =
    isTSTypeReference(type) && isIdentifier(type.typeName)
      ? type.typeName.name
      : typeNameMap[type.type]
      ? typeNameMap[type.type]
      : type.type;

  return { name };
}
