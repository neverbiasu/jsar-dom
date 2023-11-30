import { NativeDocument } from '../../impl-interfaces';
import { css } from '../helpers/spatial-css-parser';
import CSSRuleImpl from './CSSRule';
import CSSSpatialStyleDeclaration from './CSSSpatialStyleDeclaration';

export default class CSSSpatialStyleRule extends CSSRuleImpl {
  selectorText: string;
  readonly style: CSSSpatialStyleDeclaration;
  readonly styleMap: StylePropertyMap;

  constructor(
    hostObject: NativeDocument,
    args: any[],
    privateData: css.Rule & ConstructorParameters<typeof CSSRuleImpl>[2]
  ) {
    super(hostObject, args, privateData);

    if (privateData) {
      this.selectorText = privateData.selectors.join(',');
      console.log(privateData.declarations);
    }
  }
}
