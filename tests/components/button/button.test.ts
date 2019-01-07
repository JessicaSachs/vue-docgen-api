import * as path from 'path'

import { parse } from '../../../src/main'
import { ComponentDoc } from 'src/Documentation'
const button = path.join(__dirname, './Button.vue')
let docButton: ComponentDoc

describe('tests button', () => {
  beforeAll(done => {
    docButton = parse(button)
    done();
  });

  it('should return an object', () => {
    expect(typeof docButton).toEqual('object')
  });

  it('The component name should be buttonComponent', () => {
    expect(docButton.displayName).toEqual('buttonComponent')
  });

  it('The component should have a description', () => {
    expect(docButton.description).toEqual(
      'This is an example of creating a reusable button component and using it with external data.'
    );
  });

  it('should the component has two tags', () => {
    expect(Object.keys(docButton.tags).length).toEqual(2);
  });

  it('should give the component a size prop with default value to "normal"', () => {
    expect(docButton.props.size.defaultValue).toMatchObject({ value: '"normal"' });
  });

  it('should the component has size prop description equal The size of the button', () => {
    expect(docButton.props.size.description).toEqual('The size of the button');
  });

  it('should the component has color prop description equal The color for the button example', () => {
    expect(docButton.props.color.description).toEqual('The color for the button example');
  });

  it('should the component has color prop default equal #333', () => {
    expect(docButton.props.color.defaultValue).toMatchObject({ value: '"#333"' });
  });

  it('should the component has authors', () => {
    expect(docButton.tags.author).not.toBeUndefined();
  });

  it('should not see the method without tag @public', () => {
    expect(docButton.methods.length).toEqual(0);
  });

  it('should have props', () => {
    expect(docButton.props).not.toBeUndefined();
  });

  it('should the component has version', () => {
    expect(docButton.tags.version).not.toBeUndefined();
  });

  it('should the component has fourteen props', () => {
    expect(Object.keys(docButton.props).length).toEqual(14);
  });

  it('should the component has propsAnother prop default equal "blue"', () => {
    expect(docButton.props.propsAnother.defaultValue).toMatchObject({ value: '"blue"' });
  });

  it('should span to be string|number', () => {
    expect(docButton.props.span.type).toEqual({ name: 'string|number' });
  });

  it('should span has as description \'Number of columns (1-12) the column should span.\'', () => {
    expect(docButton.props.span.description).toEqual(
      'Number of columns (1-12) the column should span.',
    );
  });

  it('should span has as description \'Sm breakpoint and above\'', () => {
    expect(docButton.props.spanSm.description).toEqual('Sm breakpoint and above');
  });

  it('should spanMd has as description \'Md breakpoint and above\'', () => {
    expect(docButton.props.spanMd.description).toEqual('Md breakpoint and above');
  });

  it('should spanSm to be string|number', () => {
    expect(docButton.props.spanSm.type).toEqual({ name: 'string|number' });
  });

  it('should set funcDefault prop as a function (type "func")', () => {
    expect(docButton.props.funcDefault.type).toEqual({ name: 'func' });
  });

  it('should prop1 to be string', () => {
    expect(docButton.props.prop1.type).toMatchObject({ name: 'string' });
  });

  it('should example to be boolean', () => {
    expect(docButton.props.example.type).toEqual({ name: 'boolean' });
  });

  it('should value default example to be false', () => {
    expect(docButton.props.example.defaultValue).toMatchObject({ value: 'false' });
  });

  it('should value default example props description to be The example props', () => {
    expect(docButton.props.example.description).toEqual('The example props');
  });

  it('should v-model to be string', () => {
    expect(docButton.props['v-model'].type).toEqual({ name: 'string' });
  });

  it('should value default v-model to be example model', () => {
    expect(docButton.props['v-model'].defaultValue).toMatchObject({ value: '"example model"' });
  });

  it('should value default v-model props description to be Model example2', () => {
    expect(docButton.props['v-model'].description).toEqual('Model example2');
  });

  it('should propE to be string', () => {
    expect(docButton.props.propE.type).toEqual({ name: 'object' });
  });

  it('should value default propE to be a funtion', () => {
    const dv = docButton.props.propE.defaultValue;
    const functionNoSpaceNoReturn = dv ? dv.value.replace(/[ \n\r]/g, '') : '';
    expect(functionNoSpaceNoReturn).toEqual(`()=>{return{message:"hello"};}`);
    expect(dv ? dv.func : false).toBeTruthy();
  });

  it('should example3 to be number', () => {
    expect(docButton.props.example3).toMatchObject({ type: { name: 'number' } });
  });

  it('should value default example3 to be 16', () => {
    expect(docButton.props.example3.defaultValue).toMatchObject({ value: '16' });
  });

  it('should value default example3 props description to be The example3 props', () => {
    expect(docButton.props.example3.description).toEqual('The example3 props');
  });

  it('should onCustomClick to be ignored', () => {
    expect(docButton.props.onCustomClick.tags.ignore).toBeDefined();
  });

  it('should prop1 to be ignored', () => {
    expect(docButton.props.prop1.tags.ignore).toBeDefined();
  });

  it('should the component has one event', () => {
    expect(Object.keys(docButton.events).length).toEqual(1);
  });

  it('should the component has event, it called success', () => {
    expect(docButton.events.success).not.toBeUndefined();
  });

  it('should the description of success event is Success event.', () => {
    expect(docButton.events.success.description).toEqual('Success event.');
  });

  it('should have a slot.', () => {
    expect(Object.keys(docButton.slots).length).toEqual(1);
  });

  it('should have a default slot.', () => {
    expect(typeof docButton.slots.default !== 'undefined').toBe(true);
  });

  it('the default slot should have "Use this slot default" as description', () => {
    expect(docButton.slots.default.description).toEqual('Use this slot default');
  });

  it('should match the snapshot', () => {
    expect(docButton).toMatchSnapshot();
  });
});
