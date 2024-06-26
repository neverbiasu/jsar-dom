import { NativeDocument } from '../../impl-interfaces';
import { kCreateForImpl } from '../../symbols';
import { isElementNode, isSpatialElement } from '../node-type';
import type { BaseWindowImpl } from '../../agent/window';
import { DocumentTypeImpl } from './DocumentType';
import { NodeImpl } from './Node';
import { ElementImpl } from './Element';
import { AttrImpl } from '../attributes/Attr';
import { TextImpl } from './Text';
import { UIEventImpl } from '../events/UIEvent';
import { MouseEventImpl } from '../events/MouseEvent';
import { RangeImpl } from '../range/Range';
import DocumentOrShadowRootImpl from './DocumentOrShadowRoot';
import ParentNodeImpl from './ParentNode';
import { CustomEventImpl } from '../events/CustomEvent';
import ErrorEventImpl from '../events/ErrorEvent';
import FocusEventImpl from '../events/FocusEvent';
import HashChangeEventImpl from '../events/HashChangeEvent';
import KeyboardEventImpl from '../events/KeyboardEvent';
import MessageEventImpl from '../events/MessageEvent';
import PopStateEventImpl from '../events/PopStateEvent';
import ProgressEventImpl from '../events/ProgressEvent';
import HandTrackingEvent from '../events/HandTrackingEvent';
import TouchEventImpl from '../events/TouchEvent';
import { NodeListImpl } from './NodeList';
import NodeIteratorImpl from '../traversal/NodeIterator';
import { GlobalEventHandlersImpl } from './GlobalEventHandlers';
import { AsyncResourceQueue, ResourceQueue } from '../../agent/resources/ResourceQueue';

import { HTMLElementImpl } from './HTMLElement';
import HTMLHeadElementImpl from './HTMLHeadElement';
import HTMLLinkElementImpl from './HTMLLinkElement';
import HTMLTitleElementImpl from './HTMLTitleElement';
import HTMLMetaElementImpl from './HTMLMetaElement';
import HTMLStyleElementImpl from './HTMLStyleElement';
import HTMLScriptElementImpl from './HTMLScriptElement';
import HTMLDivElementImpl from './HTMLDivElement';
import HTMLSpanElementImpl from './HTMLSpanElement';
import HTMLImageElementImpl from './HTMLImageElement';
import HTMLParagraphElementImpl from './HTMLParagraphElement';
import { HTMLContentElement } from './HTMLContentElement';
import HTMLHeadingElementImpl from './HTMLHeadingElement';
import { SpatialElement } from './SpatialElement';
import { ShadowRootImpl } from './ShadowRoot';
import SpatialSpaceElement from './SpatialSpaceElement';
import SpatialMeshElement from './SpatialMeshElement';
import SpatialRefElement from './SpatialRefElement';
import SpatialCubeElement from './SpatialCubeElement';
import SpatialPlaneElement from './SpatialPlaneElement';
import SpatialSphereElement from './SpatialSphereElement';
import SpatialIcosphereElement from './SpatialIcosphereElement';
import SpatialBoundElement from './SpatialBoundElement';
import SpatialPanelElement from './SpatialPanelElement';
import SpatialCylinderElement from './SpatialCylinderElement';
import SpatialCapsuleElement from './SpatialCapsuleElement';
import SpatialTorusElement from './SpatialTorusElement';
import SpatialPolyhedraElement from './SpatialPolyhedraElement';
import SpatialButtonElement from './SpatialButtonElement';
import CSSSpatialStyleDeclaration from '../cssom/CSSSpatialStyleDeclaration';
import CSSSpatialKeyframesRule from '../cssom/CSSSpatialKeyframesRule';

import { applyMixins } from '../../mixin';
import { applyMemoizeQueryOn } from '../../utils';
import {
  listOfElementsWithClassNames,
  listOfElementsWithNamespaceAndLocalName,
  listOfElementsWithQualifiedName
} from '../node';
import { HTML_NS, SVG_NS } from '../helpers/namespaces';
import { canParseURL } from '../helpers/url';
import IterableWeakSet from '../helpers/iterable-weak-set';
import { domSymbolTree } from '../helpers/internal-constants';
import { firstChildWithLocalName, firstDescendantWithLocalName } from '../helpers/traversal';
import { asciiLowercase, stripAndCollapseASCIIWhitespace } from '../helpers/strings';
import { CustomLoaderHooks } from '../helpers/scripting-types';
import { validateAndExtract, name as validateName } from '../helpers/validate-names';
import {
  type HandtrackingInputDetail,
  type RaycastActionInputDetail,
  type RaycastInputDetail,
  type JSARInputEvent
} from '../../input-event';

// WebXR imports
import type XRSystemImpl from '../xr/XRSystem';
import { kSession } from '../xr/XRSystem';
import { kDispatchNextFrame, kSessionInputSourcesMap } from '../xr/XRSession';
import XRHandImpl from '../xr/XRHand';

type DocumentInitOptions = {
  screenWidth?: number;
  screenHeight?: number;
};

const eventInterfaceTable = {
  customevent: CustomEventImpl,
  errorevent: ErrorEventImpl,
  event: Event,
  events: Event,
  focusevent: FocusEventImpl,
  hashchangeevent: HashChangeEventImpl,
  htmlevents: Event,
  keyboardevent: KeyboardEventImpl,
  messageevent: MessageEventImpl,
  mouseevent: MouseEventImpl,
  mouseevents: MouseEventImpl,
  popstateevent: PopStateEventImpl,
  progressevent: ProgressEventImpl,
  svgevents: Event,
  touchevent: TouchEventImpl,
  uievent: UIEventImpl,
  uievents: UIEventImpl,
};

/**
 * The `SpatialDocument` is a new Web API, it represents the document object in space computing.
 * It is the root of the document tree, and provides the primary access to the document's data.
 */
export interface SpatialDocumentImpl<T extends NativeDocument = NativeDocument> extends NodeImpl, DocumentOrShadowRootImpl, GlobalEventHandlersImpl, ParentNodeImpl { };
export class SpatialDocumentImpl<T extends NativeDocument = NativeDocument> extends NodeImpl implements Document {
  #nativeDocument: NativeDocument;
  #screenWidth: number;
  #screenHeight: number;

  doctype: DocumentType;
  domain: string;
  contentType: string;

  get ownerDocument() {
    return null;
  }
  get URL(): string {
    return this._URL.toString();
  }
  get documentURI(): string {
    return this._URL.toString();
  }
  alinkColor: string;
  bgColor: string;

  get body(): HTMLElement {
    return null;
  }

  get space(): SpatialElement {
    return this.documentSpatialElement;
  }

  get charset(): string {
    return this._encoding;
  }
  get characterSet(): string {
    return this._encoding;
  }
  get inputEncoding(): string {
    return this._encoding;
  }
  get compatMode(): string {
    return this._parsingMode === 'xml' || this.doctype ? 'CSS1Compat' : 'BackCompat';
  }
  cookie: string;
  currentScript: HTMLOrSVGScriptElement;
  defaultView: Window & typeof globalThis;
  designMode: string;
  dir: string;

  get documentElement(): HTMLElement {
    for (const childNode of domSymbolTree.childrenIterator(this)) {
      if (childNode.nodeType === NodeImpl.ELEMENT_NODE) {
        return childNode;
      }
    }
    return null;
  }
  get documentSpatialElement(): SpatialElement {
    return this.querySelector('space');
  }

  get fgColor(): string {
    return '#ffffff';
  }
  get fullscreen(): boolean {
    throw new DOMException('fullscreen is not supported', 'NotSupportedError');
  }
  get fullscreenEnabled(): boolean {
    return false;
  }
  get head(): HTMLHeadElement {
    return this.documentElement ? firstChildWithLocalName(this.documentElement, 'head') : null;
  }
  hidden: boolean;
  get images(): HTMLCollectionOf<HTMLImageElement> {
    throw new DOMException('document.images is not supported', 'NotSupportedError');
  }
  get embeds(): HTMLCollectionOf<HTMLEmbedElement> {
    throw new DOMException('document.embeds is not supported', 'NotSupportedError');
  }
  get links(): HTMLCollectionOf<HTMLAnchorElement | HTMLAreaElement> {
    return null;
  }
  get forms(): HTMLCollectionOf<HTMLFormElement> {
    throw new DOMException('document.forms is not supported', 'NotSupportedError');
  }
  get scripts(): HTMLCollectionOf<HTMLScriptElement> {
    return this.getElementsByTagName('script');
  }
  get anchors(): HTMLCollectionOf<HTMLAnchorElement> {
    throw new DOMException('document.anchors is not supported', 'NotSupportedError');
  }
  get applets(): HTMLCollection {
    throw new DOMException('document.applets is not supported', 'NotSupportedError');
  }
  get all(): HTMLAllCollection {
    throw new DOMException('document.all is not supported', 'NotSupportedError');
  }
  get implementation(): DOMImplementation {
    throw new DOMException('document.implementation is not supported', 'NotSupportedError');
  }
  get lastModified(): string {
    return this._lastModified;
  }
  get linkColor(): string {
    return '#0000ee';
  }
  get location(): Location {
    throw new Error('window.location not implemented.');
  }
  set location(href: Location) {
    throw new Error('window.location not implemented.');
  }
  get visibilityState(): DocumentVisibilityState {
    return 'visible';
  }

  pictureInPictureEnabled: boolean;
  plugins: HTMLCollectionOf<HTMLEmbedElement>;
  readyState: DocumentReadyState;
  referrer: string;
  rootElement: SVGSVGElement;
  scrollingElement: Element;
  timeline: DocumentTimeline;
  vlinkColor: string;

  get title(): string {
    const documentElement = this.documentElement as HTMLElementImpl;
    let value = '';

    if (documentElement && documentElement.localName === 'svg') {
      const svgTitleElement = firstChildWithLocalName(documentElement, 'title', SVG_NS);
      if (svgTitleElement) {
        value = svgTitleElement.textContent;
      }
    } else {
      const titleElement = firstDescendantWithLocalName(this, 'title');
      if (titleElement) {
        value = titleElement.textContent;
      }
    }
    value = stripAndCollapseASCIIWhitespace(value);
    return value;
  }
  set title(value) {
    const documentElement = this.documentElement as HTMLElementImpl;
    let element: ElementImpl;

    if (documentElement && documentElement._localName === 'svg') {
      element = firstChildWithLocalName(documentElement, 'title', SVG_NS);
      if (!element) {
        element = this.createElementNS(SVG_NS, 'title') as unknown as ElementImpl;
        this._insert(element, documentElement.firstChild as unknown as NodeImpl);
      }
      element.textContent = value;
    } else if (documentElement && documentElement._namespaceURI === HTML_NS) {
      const titleElement = firstDescendantWithLocalName(this, 'title');
      const headElement = this.head as HTMLHeadElementImpl;

      if (titleElement === null && headElement === null) {
        return;
      }
      if (titleElement !== null) {
        element = titleElement;
      } else {
        element = this.createElement('title') as unknown as ElementImpl;
        headElement._append(element);
      }
      element.textContent = value;
    }
  }

  onfullscreenchange: (this: Document, ev: Event) => any;
  onfullscreenerror: (this: Document, ev: Event) => any;
  onpointerlockchange: (this: Document, ev: Event) => any;
  onpointerlockerror: (this: Document, ev: Event) => any;
  onreadystatechange: (this: Document, ev: Event) => any;
  onvisibilitychange: (this: Document, ev: Event) => any;

  _xsmlVersion: string;
  _ids = Object.create(null);
  _parsingMode: string = 'html';
  /**
   * @internal
   * 
   * This is used to indicate whether the script or module is started, in HTMLScriptElement, a script with "loader"
   * or "framework" type will be disallowed to execute if a script or module is started.
   */
  _isScriptOrModuleStarted: boolean = false;
  /**
   * @internal
   * 
   * This is used to get the state of the custom loaders.
   */
  _pendingCustomLoaders: Array<Promise<CustomLoaderHooks>> = [];
  /**
   * @internal
   * 
   * This is a state to get the pending script.
   */
  _pendingExecutingScript: Promise<void> = Promise.resolve(null);
  _scriptingDisabled: boolean = false;
  _encoding: string;
  _URL: URL;
  _defaultView: BaseWindowImpl<T>;
  _workingNodeIterators: IterableWeakSet<NodeIteratorImpl>;
  _asyncQueue = new AsyncResourceQueue();
  _queue = new ResourceQueue({ paused: false, asyncQueue: this._asyncQueue });
  _deferQueue = new ResourceQueue({ paused: true });
  /**
   * This is used to store the preloading spatial models which contains the mesh, transform nodes,
   * and animation groups.
   */
  _preloadingSpatialModelObservers: Map<string, Promise<boolean>> = new Map();
  _executingScriptsObservers: Set<Promise<void>> = new Set();
  _isSpaceReady: boolean = false;
  _lastModified: string;
  _lastFocusedElement: Element | null;
  _spatialKeyframesMap: Map<string, CSSSpatialKeyframesRule> = new Map();

  /** Used for spatial objects */
  _idsOfSpatialObjects: { [key: string]: SpatialElement } = {};
  _guidSOfSpatialObjects: Map<number, SpatialElement> = new Map();

  constructor(
    nativeDocument: NativeDocument,
    options: DocumentInitOptions,
    privateData: {
      options: {
        url: string;
        contentType: string;
        encoding: string;
        scriptingDisabled?: boolean;
        xsmlVersion: string;
        defaultView: BaseWindowImpl<T>;
      }
    }
  ) {
    super(nativeDocument, [], {
      defaultView: privateData.options.defaultView,
    });

    this.#nativeDocument = nativeDocument;
    if (options) {
      this.#screenWidth = options.screenWidth;
      this.#screenHeight = options.screenHeight;
    }

    this.doctype = new DocumentTypeImpl(this.#nativeDocument, [], {
      name: 'xsml',
      publicId: '-//W3C//DTD XSML 1.0//EN',
      systemId: 'https://jsar.netlify.app/spec/xsml-1.0.dtd',
      defaultView: privateData.options.defaultView,
    });
    this.nodeType = NodeImpl.DOCUMENT_NODE;
    this.domain = '';
    this.contentType = privateData.options.contentType || 'application/xsml';

    this._ownerDocument = this;
    this._attached = true;
    this._scriptingDisabled = privateData.options.scriptingDisabled;
    this._encoding = privateData.options.encoding || 'UTF-8';

    let urlOption = privateData.options.url === undefined ? 'about:blank' : privateData.options.url;
    if (!canParseURL(urlOption)) {
      urlOption = 'file://' + urlOption;
    }
    this._URL = new URL(urlOption);
    this._workingNodeIterators = new IterableWeakSet();

    // Cache of computed element styles
    this._styleCache = null;

    // Add the input event hander
    this.addEventListener('input', this._handleInputEvent);
    this.addEventListener('load', () => {
      /**
       * Wait for all the preloading spatial models to be loaded, then dispatch the "spaceReady" event.
       */
      const dispatchSpaceReadyEvent = () => {
        /**
         * We need to process the DOM symbol tree once before the "spaceReady" event is dispatched.
         */
        this._processDomSymbolTree();
        this._isSpaceReady = true;
        this.dispatchEvent(new Event('spaceReady'));
      };
      if (this._preloadingSpatialModelObservers.size === 0 &&
        this._executingScriptsObservers.size === 0) {
        dispatchSpaceReadyEvent();
      } else {
        const waitlist: Array<Promise<any>> = [];
        for (const observer of this._preloadingSpatialModelObservers.values()) {
          waitlist.push(observer);
        }
        for (const observer of this._executingScriptsObservers.values()) {
          waitlist.push(observer);
        }
        Promise.all(waitlist).then(dispatchSpaceReadyEvent);
      }
    });

    // Bypass the GOMContentLoaded event from the XSML document.
    nativeDocument.addEventListener('DOMContentLoaded', (event) => {
      this.dispatchEvent(new Event(event.type));
    });
  }

  adoptNode<T extends Node>(node: T): T {
    if (node.nodeType === NodeImpl.DOCUMENT_NODE) {
      throw new DOMException(
        'Cannot adopt a document node',
        'NotSupportedError'
      );
    } else if (node instanceof ShadowRootImpl) {
      throw new DOMException(
        'Cannot adopt a shadow root',
        'HierarchyRequestError'
      );
    }

    this._adoptNode(node);
    return node;
  }

  captureEvents(): void {
    // TODO: implement this
  }

  caretRangeFromPoint(x: number, y: number): Range {
    throw new Error('The method "document.createRangeFromPoint()" not implemented.');
  }

  clear(): void {
    throw new Error('The method "document.clear()" not implemented.');
  }

  close(): void {
    throw new Error('The method "document.close()" not implemented.');
  }

  createAttribute(localName: string): Attr {
    validateName(localName);
    if (this._parsingMode === 'html') {
      localName = asciiLowercase(localName);
    }
    return this._createAttribute({ localName });
  }

  createAttributeNS(namespace: string, qualifiedName: string): Attr {
    if (namespace === undefined) {
      namespace = null;
    }
    namespace = namespace !== null ? String(namespace) : namespace;

    const extracted = validateAndExtract(namespace, qualifiedName);
    return this._createAttribute({
      namespace: extracted.namespace,
      namespacePrefix: extracted.prefix,
      localName: extracted.localName
    });
  }

  createCDATASection(data: string): CDATASection {
    throw new DOMException('The Method "document.createCDATASection()" not implemented.', 'NotSupportedError');
  }

  createComment(data: string): Comment {
    throw new DOMException('The method "document.createComment()" not implemented.', 'NotSupportedError');
  }

  createDocumentFragment(): DocumentFragment {
    throw new Error('The method "document.createDocumentFragment()" not implemented.');
  }

  createElementNS(namespaceURI: 'http://www.w3.org/1999/xhtml', qualifiedName: string): HTMLElement;
  createElementNS<K extends keyof SVGElementTagNameMap>(namespaceURI: 'http://www.w3.org/2000/svg', qualifiedName: K): SVGElementTagNameMap[K];
  createElementNS(namespaceURI: 'http://www.w3.org/2000/svg', qualifiedName: string): SVGElement;
  createElementNS<K extends keyof MathMLElementTagNameMap>(namespaceURI: 'http://www.w3.org/1998/Math/MathML', qualifiedName: K): MathMLElementTagNameMap[K];
  createElementNS(namespaceURI: 'http://www.w3.org/1998/Math/MathML', qualifiedName: string): MathMLElement;
  createElementNS(namespaceURI: string, qualifiedName: string, options?: ElementCreationOptions): Element;
  createElementNS(namespace: string, qualifiedName: string, options?: string | ElementCreationOptions): Element;
  createElementNS(namespace: unknown, qualifiedName: unknown, options?: unknown): HTMLElement | Element | SVGElement | MathMLElement {
    throw new Error('The method "document.createElementNS()" not implemented.');
  }

  createEvent(eventInterface: 'AnimationEvent'): AnimationEvent;
  createEvent(eventInterface: 'AnimationPlaybackEvent'): AnimationPlaybackEvent;
  createEvent(eventInterface: 'AudioProcessingEvent'): AudioProcessingEvent;
  createEvent(eventInterface: 'BeforeUnloadEvent'): BeforeUnloadEvent;
  createEvent(eventInterface: 'BlobEvent'): BlobEvent;
  createEvent(eventInterface: 'ClipboardEvent'): ClipboardEvent;
  createEvent(eventInterface: 'CloseEvent'): CloseEvent;
  createEvent(eventInterface: 'CompositionEvent'): CompositionEvent;
  createEvent(eventInterface: 'CustomEvent'): CustomEvent<any>;
  createEvent(eventInterface: 'DeviceMotionEvent'): DeviceMotionEvent;
  createEvent(eventInterface: 'DeviceOrientationEvent'): DeviceOrientationEvent;
  createEvent(eventInterface: 'DragEvent'): DragEvent;
  createEvent(eventInterface: 'ErrorEvent'): ErrorEvent;
  createEvent(eventInterface: 'Event'): Event;
  createEvent(eventInterface: 'Events'): Event;
  createEvent(eventInterface: 'FocusEvent'): FocusEvent;
  createEvent(eventInterface: 'FontFaceSetLoadEvent'): FontFaceSetLoadEvent;
  createEvent(eventInterface: 'FormDataEvent'): FormDataEvent;
  createEvent(eventInterface: 'GamepadEvent'): GamepadEvent;
  createEvent(eventInterface: 'HashChangeEvent'): HashChangeEvent;
  createEvent(eventInterface: 'IDBVersionChangeEvent'): IDBVersionChangeEvent;
  createEvent(eventInterface: 'InputEvent'): InputEvent;
  createEvent(eventInterface: 'KeyboardEvent'): KeyboardEvent;
  createEvent(eventInterface: 'MIDIConnectionEvent'): MIDIConnectionEvent;
  createEvent(eventInterface: 'MIDIMessageEvent'): MIDIMessageEvent;
  createEvent(eventInterface: 'MediaEncryptedEvent'): MediaEncryptedEvent;
  createEvent(eventInterface: 'MediaKeyMessageEvent'): MediaKeyMessageEvent;
  createEvent(eventInterface: 'MediaQueryListEvent'): MediaQueryListEvent;
  createEvent(eventInterface: 'MediaStreamTrackEvent'): MediaStreamTrackEvent;
  createEvent(eventInterface: 'MessageEvent'): MessageEvent<any>;
  createEvent(eventInterface: 'MouseEvent'): MouseEvent;
  createEvent(eventInterface: 'MouseEvents'): MouseEvent;
  createEvent(eventInterface: 'MutationEvent'): MutationEvent;
  createEvent(eventInterface: 'MutationEvents'): MutationEvent;
  createEvent(eventInterface: 'OfflineAudioCompletionEvent'): OfflineAudioCompletionEvent;
  createEvent(eventInterface: 'PageTransitionEvent'): PageTransitionEvent;
  createEvent(eventInterface: 'PaymentMethodChangeEvent'): PaymentMethodChangeEvent;
  createEvent(eventInterface: 'PaymentRequestUpdateEvent'): PaymentRequestUpdateEvent;
  createEvent(eventInterface: 'PictureInPictureEvent'): PictureInPictureEvent;
  createEvent(eventInterface: 'PointerEvent'): PointerEvent;
  createEvent(eventInterface: 'PopStateEvent'): PopStateEvent;
  createEvent(eventInterface: 'ProgressEvent'): ProgressEvent<EventTarget>;
  createEvent(eventInterface: 'PromiseRejectionEvent'): PromiseRejectionEvent;
  createEvent(eventInterface: 'RTCDTMFToneChangeEvent'): RTCDTMFToneChangeEvent;
  createEvent(eventInterface: 'RTCDataChannelEvent'): RTCDataChannelEvent;
  createEvent(eventInterface: 'RTCErrorEvent'): RTCErrorEvent;
  createEvent(eventInterface: 'RTCPeerConnectionIceErrorEvent'): RTCPeerConnectionIceErrorEvent;
  createEvent(eventInterface: 'RTCPeerConnectionIceEvent'): RTCPeerConnectionIceEvent;
  createEvent(eventInterface: 'RTCTrackEvent'): RTCTrackEvent;
  createEvent(eventInterface: 'SecurityPolicyViolationEvent'): SecurityPolicyViolationEvent;
  createEvent(eventInterface: 'SpeechSynthesisErrorEvent'): SpeechSynthesisErrorEvent;
  createEvent(eventInterface: 'SpeechSynthesisEvent'): SpeechSynthesisEvent;
  createEvent(eventInterface: 'StorageEvent'): StorageEvent;
  createEvent(eventInterface: 'SubmitEvent'): SubmitEvent;
  createEvent(eventInterface: 'ToggleEvent'): ToggleEvent;
  createEvent(eventInterface: 'TouchEvent'): TouchEvent;
  createEvent(eventInterface: 'TrackEvent'): TrackEvent;
  createEvent(eventInterface: 'TransitionEvent'): TransitionEvent;
  createEvent(eventInterface: 'UIEvent'): UIEvent;
  createEvent(eventInterface: 'UIEvents'): UIEvent;
  createEvent(eventInterface: 'WebGLContextEvent'): WebGLContextEvent;
  createEvent(eventInterface: 'WheelEvent'): WheelEvent;
  createEvent(eventInterface: string): Event;
  createEvent(eventInterface: unknown): Event {
    const typeInLowercase = (eventInterface as string).toLowerCase();
    const EventConstructor = eventInterfaceTable[typeInLowercase] || null;

    if (!EventConstructor) {
      throw new DOMException(`The provided event type ("${eventInterface}") is invalid`,
        'NotSupportedError');
    }

    const event = new EventConstructor();
    return event;
  }

  addEventListener(type: 'handtracking', callback: (this: GlobalEventHandlers, ev: HandTrackingEvent) => any): void;
  addEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    return super.addEventListener(type, callback, options);
  }

  createNodeIterator(root: Node, whatToShow?: number, filter?: NodeFilter): NodeIterator {
    const nodeIterator = new NodeIteratorImpl(this._hostObject, [], {
      root: root as unknown as NodeImpl,
      whatToShow,
      filter,
    });
    this._workingNodeIterators.add(nodeIterator);
    return nodeIterator;
  }

  createProcessingInstruction(_target: string, _data: string): ProcessingInstruction {
    throw new Error('The method "document.createProcessingInstruction()" not implemented.');
  }

  createRange(): Range {
    return new RangeImpl(this._hostObject, [], {
      start: { node: this, offset: 0 },
      end: { node: this, offset: 0 },
    });
  }

  createTextNode(data: string): Text {
    return new TextImpl(this._hostObject, [], {
      data,
    });
  }

  createTreeWalker(root: Node, whatToShow?: number, filter?: NodeFilter): TreeWalker {
    throw new Error('The method "document.createTreeWalker()" not implemented.');
  }

  execCommand(commandId: string, showUI?: boolean, value?: string): boolean {
    throw new Error('The method "document.execCommand()" not implemented.');
  }

  exitFullscreen(): Promise<void> {
    throw new Error('The method "document.exitFullscreen()" not implemented.');
  }

  exitPictureInPicture(): Promise<void> {
    throw new Error('The method "document.exitPictureInPicture()" not implemented.');
  }

  exitPointerLock(): void {
    throw new Error('The method "document.exitPointerLock()" not implemented.');
  }

  getElementById(elementId: string): HTMLElement {
    if (!this._ids[elementId]) {
      return null;
    }

    // Let's find the first element with where it's root is the document.
    const matchElement = this._ids[elementId].find(candidate => {
      let root = candidate;
      while (domSymbolTree.parent(root)) {
        root = domSymbolTree.parent(root);
      }
      return root === this;
    });
    return matchElement || null;
  }

  getElementsByClassName(classNames: string): HTMLCollectionOf<Element> {
    return listOfElementsWithClassNames(classNames, this);
  }

  getElementsByName(elementName: string): NodeListOf<HTMLElement> {
    return new NodeListImpl(this._hostObject, [], {
      element: this,
      query: () => domSymbolTree.treeToArray(this, {
        filter: node => node.getAttributeNS && node.getAttributeNS(null, 'name') === elementName,
      }),
    });
  }

  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof SVGElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<SVGElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof MathMLElementTagNameMap>(qualifiedName: K): HTMLCollectionOf<MathMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof HTMLElementDeprecatedTagNameMap>(qualifiedName: K): HTMLCollectionOf<HTMLElementDeprecatedTagNameMap[K]>;
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element> {
    return listOfElementsWithQualifiedName(qualifiedName, this);
  }

  getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/1999/xhtml', localName: string): HTMLCollectionOf<HTMLElement>;
  getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/2000/svg', localName: string): HTMLCollectionOf<SVGElement>;
  getElementsByTagNameNS(namespaceURI: 'http://www.w3.org/1998/Math/MathML', localName: string): HTMLCollectionOf<MathMLElement>;
  getElementsByTagNameNS(namespace: string, localName: string): HTMLCollectionOf<Element>;
  getElementsByTagNameNS(namespace: string, localName: string): HTMLCollectionOf<Element> {
    return listOfElementsWithNamespaceAndLocalName(namespace, localName, this);
  }

  getSelection(): Selection {
    throw new DOMException('SpatialDocument do not support this method', 'NotSupportedError');
  }

  hasFocus(): boolean {
    return Boolean(this._lastFocusedElement);
  }

  async hasStorageAccess(): Promise<boolean> {
    return false;
  }

  importNode<T extends Node>(node: T, deep?: boolean): T {
    throw new Error('The method "document.importNode()" not implemented.');
  }

  open(unused1?: string, unused2?: string): Document;
  open(url: string | URL, name: string, features: string): Window;
  open(url?: unknown, name?: unknown, features?: unknown): Document | Window {
    throw new DOMException('The method "document.open()" not implemented.');
  }

  queryCommandEnabled(commandId: string): boolean {
    throw new Error('The method "document.queryCommandEnabled()" not implemented.');
  }
  queryCommandIndeterm(commandId: string): boolean {
    throw new Error('The method "document.queryCommandIndeterm()" not implemented.');
  }
  queryCommandState(commandId: string): boolean {
    throw new Error('The method "document.queryCommandState()" not implemented.');
  }
  queryCommandSupported(commandId: string): boolean {
    throw new Error('The method "document.queryCommandSupported()" not implemented.');
  }
  queryCommandValue(commandId: string): string {
    throw new Error('The method "document.queryCommandValue()" not implemented.');
  }
  releaseEvents(): void {
    throw new Error('The method "document.releaseEvents()" not implemented.');
  }
  requestStorageAccess(): Promise<void> {
    throw new Error('The method "document.requestStorageAccess()" not implemented.');
  }
  write(..._: string[]): void {
    throw new DOMException('SpatialDocument do not support this method', 'NotSupportedError');
  }
  writeln(..._: string[]): void {
    throw new DOMException('SpatialDocument do not support this method', 'NotSupportedError');
  }

  fonts: FontFaceSet;
  createExpression(expression: string, resolver?: XPathNSResolver): XPathExpression {
    throw new Error('The method "document.createExpression()" not implemented.');
  }
  createNSResolver(nodeResolver: Node): Node {
    throw new Error('The method "document.createNSResolver()" not implemented.');
  }
  evaluate(expression: string, contextNode: Node, resolver?: XPathNSResolver, type?: number, result?: XPathResult): XPathResult {
    throw new Error('The method "document.evaluate()" not implemented.');
  }

  /**
   * Get the current scene from the space.
   */
  get scene() {
    return this.#nativeDocument.getNativeScene();
  }

  get screenWidth() {
    return this.#screenWidth;
  }

  get screenHeight() {
    return this.#screenHeight;
  }

  /**
   * This returns this space pose(position, rotation) in the world.
   */
  get poseInWorld() {
    return this.#nativeDocument.getContainerPose();
  }

  attachShadow(target: SpatialElement, options?: ShadowRootInit): ShadowRoot {
    return target.attachShadow(options);
  }

  /**
   * Create an element by tag name which could be append to a `XSMLShadowRoot`.
   * @param tagName the tag name: "div", "span", "b", "a", "button" ...
   */
  // Common elements
  createElement(tagName: 'head'): HTMLTitleElement;
  createElement(tagName: 'title'): HTMLTitleElement;
  createElement(tagName: 'meta'): HTMLMetaElement;
  createElement(tagName: 'link'): HTMLLinkElement;
  createElement(tagName: 'style'): HTMLStyleElement;
  createElement(tagName: 'script'): HTMLScriptElement;
  // Spatial elements for spatial rendering
  createElement(tagName: 'space'): SpatialSpaceElement;
  createElement(tagName: 'mesh'): SpatialMeshElement;
  createElement(tagName: 'bound'): SpatialBoundElement;
  createElement(tagName: 'panel'): SpatialPanelElement;
  createElement(tagName: 'cube'): SpatialCubeElement;
  createElement(tagName: 'plane'): SpatialPlaneElement;
  createElement(tagName: 'sphere'): SpatialSphereElement;
  createElement(tagName: 'icosphere'): SpatialIcosphereElement;
  createElement(tagName: 'cylinder'): SpatialCylinderElement;
  createElement(tagName: 'capsule'): SpatialCapsuleElement;
  createElement(tagName: 'torus'): SpatialTorusElement;
  createElement(tagName: 'polyhedra'): SpatialPolyhedraElement;
  createElement(tagName: 'ref'): SpatialRefElement;
  // Spatial GUI elements
  createElement(tagName: 'button3d'): SpatialButtonElement;
  // HTML elements for texture rendering
  createElement(tagName: 'div'): HTMLDivElement;
  createElement(tagName: 'span'): HTMLSpanElement;
  createElement(tagName: 'a'): HTMLAnchorElement;
  createElement(tagName: 'b'): HTMLElement;
  createElement(tagName: 'i'): HTMLElement;
  createElement(tagName: 'p'): HTMLParagraphElement;
  createElement(tagName: 'img'): HTMLImageElement;
  createElement(tagName: 'button'): HTMLButtonElement;
  createElement(tagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'): HTMLHeadingElement;
  createElement(tagName: 'section'): HTMLElement;
  createElement(tagName: 'header'): HTMLElement;
  createElement(tagName: 'footer'): HTMLElement;
  createElement(tagName: 'nav'): HTMLElement;
  createElement(tagName: 'aside'): HTMLElement;
  createElement(tagName: 'article'): HTMLElement;

  // Universal signature
  createElement(tagName: string): Element;
  createElement(tagName: string): Element {
    switch (tagName) {
      // Common elements
      case 'head':
        return new HTMLHeadElementImpl(this.#nativeDocument, []);
      case 'title':
        return new HTMLTitleElementImpl(this.#nativeDocument, []);
      case 'meta':
        return new HTMLMetaElementImpl(this.#nativeDocument, []);
      case 'link':
        return new HTMLLinkElementImpl(this.#nativeDocument, []);
      case 'style':
        return new HTMLStyleElementImpl(this.#nativeDocument, []);
      case 'script':
        return new HTMLScriptElementImpl(this.#nativeDocument, []);

      // Spatial elements for spatial rendering
      case 'space':
        return new SpatialSpaceElement(this.#nativeDocument, []);
      case 'mesh':
        return new SpatialMeshElement(this.#nativeDocument, []);
      case 'bound':
        return new SpatialBoundElement(this.#nativeDocument, []);
      case 'panel':
        return new SpatialPanelElement(this.#nativeDocument, []);
      case 'cube':
        return new SpatialCubeElement(this.#nativeDocument, []);
      case 'plane':
        return new SpatialPlaneElement(this.#nativeDocument, []);
      case 'sphere':
        return new SpatialSphereElement(this.#nativeDocument, []);
      case 'icosphere':
        return new SpatialIcosphereElement(this.#nativeDocument, []);
      case 'cylinder':
        return new SpatialCylinderElement(this.#nativeDocument, []);
      case 'capsule':
        return new SpatialCapsuleElement(this.#nativeDocument, []);
      case 'torus':
        return new SpatialTorusElement(this.#nativeDocument, []);
      case 'polyhedra':
        return new SpatialPolyhedraElement(this.#nativeDocument, []);
      case 'ref':
        return new SpatialRefElement(this.#nativeDocument, []);

      // Spatial GUI elements
      case 'button3d':
        return new SpatialButtonElement(this.#nativeDocument, []);

      // HTML elements for texture rendering
      case 'div':
        return new HTMLDivElementImpl(this.#nativeDocument, []);
      case 'span':
        return new HTMLSpanElementImpl(this.#nativeDocument, []);
      case 'img':
        return new HTMLImageElementImpl(this.#nativeDocument, []);
      case 'p':
        return new HTMLParagraphElementImpl(this.#nativeDocument, []);
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
        return new HTMLHeadingElementImpl(this.#nativeDocument, [], { level: tagName });
      case 'header':
      case 'section':
      case 'footer':
      case 'nav':
      case 'aside':
      case 'article':
        return new HTMLContentElement(this.#nativeDocument, [], {
          localName: tagName,
        });
      case 'a':
      default:
        return new HTMLElementImpl(this.#nativeDocument, [], {
          localName: tagName,
        });
    }
  }

  /**
   * Create a new spatial object by the tag name.
   * 
   * @deprecated Please use `createElement()` instead.
   * @param tagName the tag name of the spatial element.
   */
  createSpatialObject(tagName: string, attributes: any) {
    this._hostObject.console.warn('createSpatialObject() is deprecated, please use createElement() instead.');
    const spatialElement = this.createElement(tagName);
    Object.keys(attributes).forEach((key) => {
      spatialElement.setAttribute(key, attributes[key]);
    });
    return spatialElement;
  }

  /**
   * This method create a new `SpatialElement` by a reference to the native object `BABYLON.Node`, it's useful to create 
   * `SpatialElement`s which is created by model or created by Babylon.js.
   * 
   * @param nativeObject The native object, namely `BABYLON.Node`.
   * @returns a new `SpatialElement` instance to reference the native object.
   */
  createSpatialElementByNativeReference(nativeObject: BABYLON.Node) {
    const element = this.createElement('ref');
    element.ref(nativeObject);
    return element;
  }

  /**
   * This method create a new `SpatialElement` by a reference to the native object `BABYLON.Node`, it's useful to create `SpatialElement`s 
   * which is created by model or created by Babylon.js.
   * 
   * @deprecated Please use `createSpatialElementByNativeReference()` instead.
   * @param nativeObject The native object, namely `BABYLON.Node`.
   * @returns a new `SpatialElement` instance to reference the native object.
   */
  createSpatialObjectByNativeReference(nativeObject: BABYLON.Node) {
    this._hostObject.console.warn('createSpatialObjectByNativeReference() is deprecated, please use createSpatialElementByNativeReference() instead.');
    return this.createSpatialElementByNativeReference(nativeObject);
  }

  /**
   * The `getSpatialObjectById()` method of the `SpatialDocument` interface returns an `SpatialObject` object representing the object whose id property matches the specified string. 
   * Since element IDs are required to be unique if specified, they're a useful way to get access to a specific element quickly.
   */
  getSpatialObjectById(id: string): SpatialElement {
    const element = this.getElementById(id);
    if (isSpatialElement(element)) {
      return element;
    } else {
      return undefined;
    }
  }

  /**
   * This is used to get the spatial object by the transmute GUID.
   * @internal
   */
  _getSpatialObjectByGuid(guid: number): SpatialElement {
    return this._guidSOfSpatialObjects.get(guid);
  }

  /**
   * Wrap and execute a function with time profiling.
   * 
   * @internal
   * @param tag the log tag
   * @param fn the function to be executed, it accepts an async function or blocking function.
   */
  async _executeWithTimeProfiler<T>(tag: string, fn: (...args: any[]) => Promise<T> | T): Promise<T> {
    const startTime = performance.now();

    let r: T;
    const valueFuture = fn();
    if (valueFuture instanceof Promise) {
      r = await valueFuture;
    } else {
      r = valueFuture;
    }
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    const message = `${tag} takes ${Math.floor(executionTime)}ms`;

    this.#nativeDocument.console.debug(message);
    return r;
  }

  #cloneWithOriginalRefs(
    source: BABYLON.Node,
    name: string,
    newParent: BABYLON.Node,
    onClonedObversaval?: (origin: BABYLON.Node, cloned: BABYLON.Node) => void
  ): BABYLON.Node {
    const result = source.clone(name, newParent, true);
    result.setEnabled(true);

    if (typeof onClonedObversaval === 'function') {
      onClonedObversaval(source, result);
    }
    const directDescendantsOfSource = source.getDescendants(true);
    for (let child of directDescendantsOfSource) {
      this.#cloneWithOriginalRefs(child, child.name, result, onClonedObversaval);
    }
    return result;
  }

  /**
   * Start watching the input event such as: pointer, guesture, keyboard, etc.
   */
  watchInputEvent() {
    return this.#nativeDocument.observeInputEvent();
  }

  /**
   * Get the node by the id.
   * 
   * @deprecated
   */
  getNodeById(id: string): BABYLON.Node {
    this.#nativeDocument.console.warn(`The method "getNodeById()" is deprecated, please use "getElementById()" instead.`);
    return this.scene.getNodeById(id);
  }

  /**
   * Get the material by the id.
   */
  getMaterialById(id: string): BABYLON.Material {
    return this.scene.getMaterialById(id);
  }

  private _handleHandTrackingEventDetail(detail: HandtrackingInputDetail): boolean {
    /**
     * @deprecated
     * 
     * Dispatch the global event `handtracking` to the document, it will be deprecated when the 
     * WebXR Hand Input API is ready.
     */
    const handtrackingGlobalEvent = new HandTrackingEvent(detail);
    this.dispatchEvent(handtrackingGlobalEvent);

    /**
     * Check if the WebXR session is created and update the XRInputSourceArray.
     */
    if (this._defaultView?.navigator.xr) {
      const xrSystemImpl = this._defaultView.navigator.xr as XRSystemImpl;
      const xrSession = xrSystemImpl[kSession];
      if (xrSession != null) {
        const handId = detail.handId;
        const inputSourcesMap = xrSession[kSessionInputSourcesMap];
        const newInputSource = this._createXRHandInputSource(detail);
        if (!inputSourcesMap.has(handId)) {
          inputSourcesMap.set(handId, newInputSource);
        } else {
          const inputSource = inputSourcesMap.get(handId);
          inputSourcesMap.set(handId, {
            ...inputSource,
            ...newInputSource,
          });
        }
        xrSession[kDispatchNextFrame]();
      }
    }
    return true;
  }

  private _createXRHandInputSource(detail: HandtrackingInputDetail): XRInputSource {
    let handedness: XRHandedness;
    if (detail.handId === 0) {
      handedness = 'left';
    } else if (detail.handId === 1) {
      handedness = 'right';
    } else {
      handedness = 'none';
    }

    return {
      handedness,
      targetRayMode: 'tracked-pointer',
      targetRaySpace: null, // TODO
      profiles: ['hand-tracking'],
      gripSpace: null,      // TODO
      gamepad: null,        // TODO
      hand: XRHandImpl[kCreateForImpl](this._hostObject, detail.joints),
    } as XRInputSource;
  }

  private _latestRaycastTimestamp: number;
  private _lastPickedSpatialObject: SpatialElement;
  private _lastPickingTimeout: NodeJS.Timeout;

  private _handleRaycastEventDetail(detail: RaycastInputDetail): boolean {
    this._latestRaycastTimestamp = Date.now();
    clearTimeout(this._lastPickingTimeout);

    const guid = detail.targetSpatialElementInternalGuid;
    let targetNativeNode: BABYLON.Node;
    const targetSpatialObject = this._getSpatialObjectByGuid(guid);
    if (targetSpatialObject) {
      /**
       * Update the `lastPickedSpatialObject` when find a spatial object in "raycast" event.
       */
      if (this._lastPickedSpatialObject && this._lastPickedSpatialObject !== targetSpatialObject) {
        this._lastPickedSpatialObject._processUnpicking();
        this._lastPickedSpatialObject = null;
      }
      this._lastPickedSpatialObject = targetSpatialObject;

      /**
       * Do the picking process.
       */
      targetSpatialObject._processPicking(detail);
      this._lastPickingTimeout = setTimeout(() => {
        targetSpatialObject._processUnpicking();
        this._lastPickedSpatialObject = null;
      }, 100);

      /**
       * Update the `targetNativeNode` for the deprecated global event `RaycastHitEvent`.
       */
      targetNativeNode = targetSpatialObject.asNativeType<BABYLON.Node>();
    } else {
      // try to find it from the native(BABYLON) nodes.
      targetNativeNode = this.scene.getNodes().find((node: any) => node.__vgoGuid === guid);
    }

    // TODO: dispatch event to native nodes?
    return true;
  }

  private _handleRaycastActionEventDetail(detail: RaycastActionInputDetail): boolean {
    if (!this._lastPickedSpatialObject || this._lastPickedSpatialObject == null) {
      /**
       * If the `lastPickedSpatialObject` is null, we should ignore the action event.
       */
      return;
    }

    this._lastPickedSpatialObject._dispatchPointerEvent({
      'up': BABYLON.PointerEventTypes.POINTERUP,
      'down': BABYLON.PointerEventTypes.POINTERDOWN,
    }[detail.type]);
    return true;
  }

  private _handleInputEvent = (event: JSARInputEvent): boolean => {
    if (event.subType === 'handtracking') {
      return this._handleHandTrackingEventDetail(event.detail as HandtrackingInputDetail);
    } else if (event.subType === 'raycast') {
      return this._handleRaycastEventDetail(event.detail as RaycastInputDetail);
    } else if (event.subType === 'raycast_action') {
      return this._handleRaycastActionEventDetail(event.detail as RaycastActionInputDetail);
    } else {
      return true;
    }
  }

  private _processDomSymbolTree() {
    const defaultView = this._defaultView;
    if (!defaultView) {
      return;
    }
    // TODO: add a dirty check for the tree iterating.
    domSymbolTree.treeToArray(this, {
      filter: node => isElementNode(node)
    })
      .filter((node: ElementImpl) => isSpatialElement(node))
      .forEach((node: SpatialElement) => {
        const style = defaultView.getComputedSpatialStyle(node);
        node._adoptStyle(style);
      });
  }

  private _onPreRenderLoop() {
    this.#nativeDocument.getNativeScene()
      .onBeforeRenderObservable.add(() => {
        this._processDomSymbolTree();
      });
  }

  /**
   * @internal
   * Start the document, it executes the scripts.
   */
  _start(noQueue = false) {
    // Execute render loop
    if (!noQueue) {
      this._onPreRenderLoop();
    }

    // In no queue mode, the document will not execute the scripts.
    if (noQueue) {
      this.readyState = 'complete';
      this.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
      this.dispatchEvent(new Event('load'));
      return;
    }

    // Resume the queue
    this._queue.resume();

    // Handle the defer and async queue
    const ownerDocument = this;
    const dummyPromise = Promise.resolve();
    this._queue.push(dummyPromise, function onDOMContentLoaded(): Promise<void> {
      const dispatchEvent = () => {
        // https://html.spec.whatwg.org/#the-end
        ownerDocument.readyState = 'interactive';
        ownerDocument.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
      };
      return new Promise<void>(resolve => {
        if (!ownerDocument._deferQueue.tail) {
          dispatchEvent();
          resolve();
        } else {
          ownerDocument._deferQueue.setListener(() => {
            dispatchEvent();
            resolve();
          });
          ownerDocument._deferQueue.resume();
        }
      });
    }, null);

    // Set the readyState to 'complete' once all resources are loaded.
    // As a side-effect the document's load-event will be dispatched.
    this._queue.push(dummyPromise, function onLoad(): Promise<void> {
      const dispatchEvent = () => {
        ownerDocument.readyState = 'complete';
        ownerDocument.dispatchEvent(new Event('load'));
      };
      return new Promise<void>(resolve => {
        if (ownerDocument._asyncQueue.count() === 0) {
          dispatchEvent();
          resolve();
        } else {
          this._asyncQueue.setListener(() => {
            dispatchEvent();
            resolve();
          });
        }
      });
    }, null, true);
  }

  _stop() {
    this.removeEventListener('input', this._handleInputEvent);
  }

  // https://dom.spec.whatwg.org/#concept-node-adopt
  _adoptNode(node: Node) {
    const parent = domSymbolTree.parent(node);
    if (parent) {
      parent._remove(node);
    }
  }

  _runPreRemovingSteps(oldNode: NodeImpl) {
    // https://html.spec.whatwg.org/#focus-fixup-rule
    if (oldNode === this.activeElement) {
      this._lastFocusedElement = null;
    }
    for (const activeNodeIterator of this._workingNodeIterators) {
      activeNodeIterator._preRemovingSteps(oldNode);
    }
  }

  _createAttribute(privateData: ConstructorParameters<typeof AttrImpl>[2]) {
    return new AttrImpl(this._hostObject, [], privateData);
  }
}

applyMixins(SpatialDocumentImpl, [DocumentOrShadowRootImpl, GlobalEventHandlersImpl, ParentNodeImpl]);
applyMemoizeQueryOn(SpatialDocumentImpl.prototype, 'getElementsByTagName');
applyMemoizeQueryOn(SpatialDocumentImpl.prototype, 'getElementsByTagNameNS');
applyMemoizeQueryOn(SpatialDocumentImpl.prototype, 'getElementsByClassName');
