import { NativeDocument } from '../../impl-interfaces';
import { InteractiveDynamicTexture } from '../helpers/babylonjs/InteractiveDynamicTexture';

import { SpatialElement } from './SpatialElement';
import DocumentFragmentImpl from './DocumentFragment';
import DocumentOrShadowRootImpl from './DocumentOrShadowRoot';
import InnerHTMLImpl from '../domparsing/InnerHTML';
import { applyMixins } from '../../mixin';

export interface ShadowRootImpl extends DocumentFragmentImpl, DocumentOrShadowRootImpl, InnerHTMLImpl { };
export class ShadowRootImpl extends DocumentFragmentImpl implements ShadowRoot {
  get mode(): ShadowRootMode {
    return this._mode;
  }
  get delegatesFocus(): boolean {
    return this._delegatesFocus;
  }
  get slotAssignment(): SlotAssignmentMode {
    return this._slotAssignment;
  }
  get host(): Element {
    return this._targetSpatialElement;
  }
  onslotchange: (this: ShadowRoot, ev: Event) => any;

  /** @internal */
  _lastFocusedElement: Element;
  /** @internal */
  _targetSpatialElement: SpatialElement;
  /** @internal */
  _interactiveDynamicTexture: InteractiveDynamicTexture;

  private _mode: ShadowRootMode = 'open';
  private _delegatesFocus: boolean = false;
  private _slotAssignment: SlotAssignmentMode = 'manual';

  constructor(
    hostObject: NativeDocument,
    args: [ShadowRootInit?],
    privateData: {
      target: SpatialElement;
    }
  ) {
    super(hostObject, [], null);

    if (args[0]) {
      const init = args[0];
      this._mode = init.mode;
      this._delegatesFocus = init.delegatesFocus;
      this._slotAssignment = init.slotAssignment;
    }
    this._targetSpatialElement = privateData.target;
  }

  _attach() {
    const targetMesh = this._targetSpatialElement.asNativeType<BABYLON.AbstractMesh>();
    this._interactiveDynamicTexture = InteractiveDynamicTexture.CreateForMesh(this, targetMesh);
    this._interactiveDynamicTexture.start();
    super._attach();
  }

  _detach(): void {
    super._detach();
    this._interactiveDynamicTexture.dispose();
  }

  /**
   * @internal
   * @returns the native texture of this shadow root.
   */
  _getNativeTexture(): InteractiveDynamicTexture {
    return this._interactiveDynamicTexture;
  }
}

applyMixins(ShadowRootImpl, [DocumentOrShadowRootImpl, InnerHTMLImpl]);
