import { parseSpatialCss } from '../helpers/spatial-css-parser';
import { type CSSSpatialStyleProperties, mixinWithSpatialStyleProperties } from './spatial-properties';

export default interface CSSSpatialStyleDeclaration extends Array<string>, CSSSpatialStyleProperties { }
export default class CSSSpatialStyleDeclaration extends Array<string> {
  _values: Map<string, string> = new Map();
  _importants: Map<string, string> = new Map();
  _onChange: (cssText?: string) => void;

  constructor(onChange: (cssText?: string) => void) {
    super();
    this._onChange = onChange;
  }

  get cssText(): string {
    const properties: string[] = [];
    for (let i = 0; i < this.length; i++) {
      const name = this[i];
      const value = this.getPropertyValue(name);
      let priority = this.getPropertyPriority(name);
      if (priority !== '') {
        priority = ` !${priority}`;
      }
      properties.push([name, ': ', value, priority, ';'].join(''));
    }
    return properties.join(' ');
  }
  set cssText(value: string) {
    this._values.clear();
    this._importants.clear();
    Array.prototype.splice.call(this, 0, this.length);

    let dummyRule;
    try {
      dummyRule = parseSpatialCss('#bogus{' + value + '}').stylesheet.rules[0];
    } catch (err) {
      // malformed css, just return
      return;
    }

    // var rule_length = dummyRule.length;
    // var name;
    // for (i = 0; i < rule_length; ++i) {
    //   name = dummyRule[i];
    //   this.setProperty(
    //     dummyRule[i],
    //     dummyRule.getPropertyValue(name),
    //     dummyRule.getPropertyPriority(name)
    //   );
    // }
    // this._onChange(this.cssText);
  }

  get parentRule(): CSSRule {
    return null;
  }

  getPropertyValue(name: string): string {
    if (!this._values.hasOwnProperty(name)) {
      return '';
    }
    return this._values[name].toString();
  }

  setProperty(name: string, value: string, priority?: string) {
    if (value === undefined) {
      return;
    }
    if (value === null || value === '') {
      this.removeProperty(name);
      return;
    }
    const isCustomProperty = name.indexOf('--') === 0;
    if (isCustomProperty) {
      this._setProperty(name, value, priority);
      return;
    }
    const lowercaseName = name.toLowerCase();
    // TODO
    // if (!allProperties.has(lowercaseName) && !allExtraProperties.has(lowercaseName)) {
    //   return;
    // }

    this[lowercaseName] = value;
    this._importants[lowercaseName] = priority;
  }

  _setProperty(name: string, value: string, priority?: string) {
    if (value === undefined) {
      return;
    }
    if (value === null || value === '') {
      this.removeProperty(name);
      return;
    }
    if (this._values[name]) {
      // Property already exist. Overwrite it.
      var index = Array.prototype.indexOf.call(this, name);
      if (index < 0) {
        this[this.length] = name;
        this.length++;
      }
    } else {
      // New property.
      this[this.length] = name;
      this.length++;
    }
    this._values[name] = value;
    this._importants[name] = priority;
    this._onChange(this.cssText);
  }

  removeProperty(name: string): string {
    if (!this._values.hasOwnProperty(name)) {
      return '';
    }

    const prevValue = this._values[name];
    delete this._values[name];
    delete this._importants[name];

    const index = Array.prototype.indexOf.call(this, name);
    if (index < 0) {
      return prevValue;
    }

    // That's what WebKit and Opera do
    Array.prototype.splice.call(this, index, 1);

    // That's what Firefox does
    //this[index] = ""

    this._onChange(this.cssText);
    return prevValue;
  }

  getPropertyPriority(name: string): string {
    return this._importants[name] || '';
  }

  getPropertyCSSValue() {
    // TODO
    return;
  }

  getPropertyShorthand() {
    // TODO
    return;
  }

  isPropertyImplicit() {
    // TODO
    return;
  }

  item(index: number | string) {
    if (typeof index === 'string') {
      index = parseInt(index, 10);
    }
    if (index < 0 || index >= this.length) {
      return '';
    }
    return this[index];
  }
}

mixinWithSpatialStyleProperties(CSSSpatialStyleDeclaration.prototype);
