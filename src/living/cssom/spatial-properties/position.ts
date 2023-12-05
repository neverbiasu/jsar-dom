import { defineSpatialProperty } from './helper';
import {
  CSSValueType,
  valueType,
  implicitSetter,
  toNumberStr,
} from '../parsers';

function positionValidator(v): boolean {
  if (v.toLowerCase() === 'auto') {
    return true;
  }
  const type = valueType(v);
  return (
    type === CSSValueType.LENGTH ||
    type === CSSValueType.INTEGER
  );
}
function toPositionStr(v: string) {
  v = v.toLowerCase();
  if (v === 'auto') {
    return v;
  }
  return toNumberStr(v);
}

const valueSetter = implicitSetter(
  'position',
  '',
  ['x', 'y', 'z'],
  positionValidator,
  toPositionStr
);
const globalSetter = implicitSetter(
  'position',
  '',
  ['x', 'y', 'z'],
  () => true,
  (v) => v
);

export default defineSpatialProperty({
  enumerable: true,
  configurable: true,
  get(): string {
    return this.getPropertyValue('position');
  },
  set(value: string) {
    if (typeof value === 'number') {
      value = String(value);
    }
    if (typeof value !== 'string') {
      return;
    }

    const _v = value.trim().toLowerCase();
    switch (_v) {
      case 'inherit':
      case 'initial':
      case 'unset':
      case '':
        globalSetter.call(this, _v);
        break;
      default:
        valueSetter.call(this, _v);
        break;
    }
  },
});
