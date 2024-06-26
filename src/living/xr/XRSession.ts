import DOMException from '../domexception';
import { NativeDocument, XRFeature, XRSessionBackend } from '../../impl-interfaces';
import XRFrameImpl from './XRFrame';
import XRInputSourceArrayImpl from './XRInputSourceArray';

export const kSessionInputSourcesMap = Symbol('kSessionInputSources');
export const kSessionVisibilityState = Symbol('kSessionVisibilityState');
export const kDispatchNextFrame = Symbol('kDispatchNextFrame');

export default class XRSessionImpl extends EventTarget implements XRSession {
  #nativeDocument: NativeDocument;
  #nextAnimationFrameId = 0;
  #nextAnimationFrameCallbacks: Map<number, XRFrameRequestCallback> = new Map();
  #sessionBackend: XRSessionBackend;

  [kSessionInputSourcesMap]: Map<number, XRInputSource> = new Map();
  [kSessionVisibilityState]: XRVisibilityState = 'visible';

  get inputSources(): XRInputSourceArray {
    return XRInputSourceArrayImpl.createFromIterator(this[kSessionInputSourcesMap].values());
  }

  get renderState(): XRRenderState {
    throw new DOMException('renderState is disallowed to use in XSML', 'NOT_SUPPORTED_ERR');
  }

  get environmentBlendMode(): XREnvironmentBlendMode {
    throw new DOMException('environmentBlendMode is disallowed to use in XSML', 'NOT_SUPPORTED_ERR');
  }
  set environmentBlendMode(_value: XREnvironmentBlendMode) {
    throw new DOMException('environmentBlendMode is disallowed to use in XSML', 'NOT_SUPPORTED_ERR');
  }

  get visibilityState(): XRVisibilityState {
    return this[kSessionVisibilityState];
  }

  get frameRate(): number {
    return this.#nativeDocument.engine.getFps();
  }

  supportedFrameRates?: Float32Array;
  domOverlayState?: XRDOMOverlayState;
  preferredReflectionFormat?: XRReflectionFormat;
  depthUsage: XRDepthUsage;
  depthDataFormat: XRDepthDataFormat;

  get enabledFeatures(): string[] {
    return this.#sessionBackend.enabledFeatures as string[];
  }

  onend: XRSessionEventHandler;
  oninputsourceschange: XRInputSourceChangeEventHandler;
  onselect: XRInputSourceEventHandler;
  onselectstart: XRInputSourceEventHandler;
  onselectend: XRInputSourceEventHandler;
  onsqueeze: XRInputSourceEventHandler;
  onsqueezestart: XRInputSourceEventHandler;
  onsqueezeend: XRInputSourceEventHandler;
  onvisibilitychange: XRSessionEventHandler;
  onframeratechange: XRSessionEventHandler;
  requestHitTestSource?: (options: XRHitTestOptionsInit) => Promise<XRHitTestSource>;
  requestHitTestSourceForTransientInput?: (options: XRTransientInputHitTestOptionsInit) => Promise<XRTransientInputHitTestSource>;
  requestHitTest?: (ray: XRRay, referenceSpace: XRReferenceSpace) => Promise<XRHitResult[]>;
  updateWorldTrackingState?: (options: { planeDetectionState?: { enabled: boolean; }; }) => void;

  static async createForImpl(
    hostObject: NativeDocument,
    args: [XRSessionMode, XRSessionInit] = [null, null],
    _privateData = null
  ): Promise<XRSessionImpl> {
    if (typeof hostObject.userAgent.createXRSessionBackend !== 'function') {
      throw new DOMException('WebXR backend is not supported', 'NOT_SUPPORTED_ERR');
    }

    const session = new XRSessionImpl();
    session.#nativeDocument = hostObject;

    const [mode, init] = args;
    session.#sessionBackend = hostObject.userAgent.createXRSessionBackend({
      immersiveMode: mode,
      requiredFeatures: (init?.requiredFeatures as XRFeature[]),
      optionalFeatures: (init?.optionalFeatures as XRFeature[]),
    });
    await session.#sessionBackend.request();
    return session;
  }

  private get _nativeScene(): BABYLON.Scene {
    return this.#nativeDocument.getNativeScene();
  }

  async end(): Promise<void> {
    await this.#sessionBackend.end();
  }

  cancelAnimationFrame(id: number): void {
    this.#nextAnimationFrameCallbacks.delete(id);
  }

  requestAnimationFrame(callback: XRFrameRequestCallback): number {
    const id = this.#nextAnimationFrameId++;
    this._nativeScene.onBeforeRenderObservable.addOnce(() => {
      this.#nextAnimationFrameCallbacks.set(id, callback);
    });
    return id;
  }

  /**
   * The `requestReferenceSpace()` method of the XRSession interface returns a promise that resolves with 
   * an instance of either XRReferenceSpace or XRBoundedReferenceSpace as appropriate given the type of 
   * reference space requested.
   * 
   * @param type 
   */
  requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace | XRBoundedReferenceSpace> {
    return this.#sessionBackend.requestReferenceSpace(type);
  }

  /**
   * In XSML, an object is the programable object in a scene, this method `updateRenderState()` is used to update
   * the global-scoped states such as the base layer, camera, and so on, which is not supported to be updated in XSML.
   * @param _renderStateInit 
   */
  updateRenderState(_renderStateInit?: XRRenderStateInit): Promise<void> {
    throw new DOMException('updateRenderState() is disallowed to used in XSML', 'NOT_SUPPORTED_ERR');
  }

  updateTargetFrameRate(_rate: number): Promise<void> {
    throw new DOMException('updateTargetFrameRate() is disallowed to used in XSML', 'NOT_SUPPORTED_ERR');
  }

  requestLightProbe(_init?: XRLightProbeInit): Promise<XRLightProbe> {
    throw new DOMException('requestLightProbe() is not supported', 'NOT_SUPPORTED_ERR');
  }

  trySetFeaturePointCloudEnabled(_enabled: boolean): boolean {
    return false;
  }

  trySetPreferredPlaneDetectorOptions(_preferredOptions: XRGeometryDetectorOptions): boolean {
    return false;
  }

  trySetMeshDetectorEnabled(_enabled: boolean): boolean {
    return false;
  }

  trySetPreferredMeshDetectorOptions(_preferredOptions: XRGeometryDetectorOptions): boolean {
    return false;
  }

  [kDispatchNextFrame](): void {
    const timestamp = Date.now();
    const frame = new XRFrameImpl(this.#nativeDocument, [], { session: this });
    for (const callback of this.#nextAnimationFrameCallbacks.values()) {
      callback(timestamp, frame);
    }
    this.#nextAnimationFrameCallbacks.clear();
  }
}
