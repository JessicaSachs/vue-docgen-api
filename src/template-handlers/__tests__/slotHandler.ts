import { compile } from 'vue-template-compiler'
import { Documentation } from '../../Documentation'
import { traverse } from '../../parse-template'
import slotHandler from '../slotHandler'

describe('slotHandler', () => {
  let doc: Documentation
  beforeEach(() => {
    doc = new Documentation()
  })

  it('should pick comments before slots', () => {
    const ast = compile(
      [
        '<div>',
        '  <h1>titleof the template</h1>',
        '  <!-- @slot a default slot-->',
        '  <slot></slot>',
        '</div>',
      ].join('\n'),
      { comments: true },
    ).ast
    if (ast) {
      traverse(ast, doc, [slotHandler], { functional: false })
      expect(doc.toObject().slots.default).toMatchObject({ description: 'a default slot' })
    } else {
      fail()
    }
  })

  it('should pick up the name of a slot', () => {
    const ast = compile(
      [
        '<div>',
        '  <h1>titleof the template</h1>',
        '  <!-- @slot a slot named oeuf -->',
        '  <slot name="oeuf"></slot>',
        '</div>',
      ].join('\n'),
      { comments: true },
    ).ast
    if (ast) {
      traverse(ast, doc, [slotHandler], { functional: false })
      expect(doc.toObject().slots.oeuf).toMatchObject({ description: 'a slot named oeuf' })
    } else {
      fail()
    }
  })
})
