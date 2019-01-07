import { BlockTag } from './utils/blockTags';

export interface PropDescriptor {
  type?: { name: string; func?: boolean };
  comment: string;
  description: string;
  required: string | boolean;
  defaultValue?: { value: string; func?: boolean };
  tags: { [title: string]: BlockTag[] };
}

interface MethodDescriptor {
  name: string;
}

export interface ComponentDoc {
  displayName: string;
  props: { [propName: string]: PropDescriptor };
  methods: MethodDescriptor[];
  [key: string]: any;
}

export class Documentation {
  private propsMap: Map<string, any>;
  private dataMap: Map<string, any>;
  constructor(initDocumentation: { props?: any; data?: any } = {}) {
    this.propsMap = new Map(adaptToKeyValue(initDocumentation.props));
    this.dataMap = new Map(adaptToKeyValue(initDocumentation.data));
  }

  public set(key: string, value: any) {
    this.dataMap.set(key, value);
  }

  public get(key: string): any {
    return this.dataMap.get(key);
  }

  public getPropDescriptor(propName: string): PropDescriptor {
    let propDescriptor: PropDescriptor = this.propsMap.get(propName) as PropDescriptor;
    if (!propDescriptor) {
      this.propsMap.set(
        propName,
        (propDescriptor = {
          comment: '',
          description: '',
          required: '',
          tags: {},
        }),
      );
    }
    return propDescriptor;
  }

  public toObject() {
    const obj: ComponentDoc = {
      props: undefined,
      methods: undefined,
    };

    for (const [key, value] of this.dataMap) {
      obj[key] = value;
    }

    if (this.propsMap.size > 0) {
      obj.props = {};
      for (const [name, descriptor] of this.propsMap) {
        obj.props[name] = descriptor;
      }
    }

    return obj;
  }
}

/**
 * Transforms an object into an array of tuples [key, value]
 * @param {Object} obj
 * @returns {Array<[key, value]>} the retransfromed array and [] if obj is null
 */
function adaptToKeyValue(obj: { [key: string]: any } | undefined): Array<[string, any]> {
  const keyValuePairs: Array<[string, any]> = obj
    ? Object.keys(obj).map((k: string) => {
        const kvp: [string, any] = [k, obj[k]];
        return kvp;
      })
    : [];
  return keyValuePairs;
}
