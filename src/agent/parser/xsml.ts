import DOMException from 'domexception';
import { XMLParser } from 'fast-xml-parser';
import { toNode } from './xml-utils';
import { SpatialDocumentImpl } from '../../living/nodes/SpatialDocument';
import { TextImpl } from '../../living/nodes/Text';
import { HTMLElementImpl } from '../../living/nodes/HTMLElement';
import { isHTMLContentElement, isHTMLStyleElement, isSpatialElement } from '../../living/node-type';

class XSMLParser {
  xmlParser: XMLParser;

  constructor() {
    this.xmlParser = new XMLParser({
      preserveOrder: true,
      ignoreAttributes: false,
      unpairedTags: ['link', 'meta'],
      stopNodes: ['*.pre', '*.script'],
      processEntities: true,
      htmlEntities: true,
    });
  }

  parseIntoDocument(markup: string, ownerDocument: SpatialDocumentImpl) {
    const parsedDocument = this.xmlParser.parse(markup);
    if (parsedDocument.length > 1) {
      throw new TypeError('Invalid XSML document, only one <xsml> tag is allowed.');
    }
    if (!parsedDocument[0].xsml) {
      throw new TypeError('Invalid XSML document, the root tag must be <xsml>.');
    }

    const xsmlNode = toNode(parsedDocument[0]);
    const xsmlElement = this.#createElementOrTextNode(xsmlNode, ownerDocument);
    if (xsmlElement instanceof TextImpl) {
      throw new DOMException('Invalid XSML document, the root tag must be <xsml>.', 'HierarchyRequestError');
    }
    ownerDocument.appendChild(xsmlElement);
    ownerDocument._xsmlVersion = xsmlNode.attrs.version;

    // Traverse the tree and create the DOM.
    this.#traverse(xsmlNode, xsmlElement, ownerDocument);
  }

  #createElementOrTextNode(node: ReturnType<typeof toNode>, ownerDocument: Document): TextImpl | HTMLElementImpl {
    // TODO: handle custom-element creation.

    /**
     * A `Node` instance that will be appended to the parent.
     */
    let element: TextImpl | HTMLElementImpl;

    // Check if this node is a #text.
    if (node.name === '#text') {
      // Create a text node and assign to `element`.
      element = ownerDocument.createTextNode(node.text) as TextImpl;
    } else {
      // Create the element.
      element = ownerDocument.createElement(node.name) as HTMLElementImpl;

      // Adopt the attributes.
      for (const [key, value] of Object.entries(node.attrs)) {
        // Remove the "@_" prefix which is generated by fast-xml-parser.
        element.setAttribute(key.replace(/^\@_/, ''), value);
      }
    }
    return element;
  }

  #traverse(node: ReturnType<typeof toNode>, parent: Document | DocumentFragment | Element, ownerDocument: Document) {
    if (!Array.isArray(node.children)) {
      return;
    }
    for (const child of node.children) {
      const childNode = toNode(child);
      const childElement = this.#createElementOrTextNode(childNode, ownerDocument);
      if (childElement instanceof TextImpl) {
        parent.appendChild(childElement);
        continue;
      } else {
        /**
         * Skip Case 1: Disallow a spatial element to be a child of a HTML content element.
         */
        if (isSpatialElement(childElement) && isHTMLContentElement(parent)) {
          continue;
        }
        /**
         * FIXME: More skip cases?
         */

        /**
         * If the child element is a HTML content element or a style element with a text/css in a spatial element,
         * we need to create a shadow root and append the child element to it instead of root.
         */
        if (isSpatialElement(parent)) {
          const isCSSStyleElement = isHTMLStyleElement(childElement) && childElement.type === 'text/css';
          if (isHTMLContentElement(childElement) || isCSSStyleElement) {
            /**
             * This create the shadow root on the parent spatial element only, then the shadow
             * root will be attached when the spatial element is attached.
             * 
             * We check if the parent's shadowRoot is created, if not created, we need to create one, otherwise just
             * use the created shadow root instance.
             */
            if (!parent.shadowRoot || parent.shadowRoot == null) {
              parent._createShadowRoot();
            }
            const shadowRoot = parent.shadowRoot;
            if (shadowRoot) {
              this.#traverse(childNode, childElement, ownerDocument);
              shadowRoot.appendChild(childElement);
            }
            continue;
          }
        }

        /**
         * Otherwise, just traverse and append the child to parent.
         */
        this.#traverse(childNode, childElement, ownerDocument);
        parent.appendChild(childElement);
      }
    }
  }
}

export function parseIntoDocument(markup: string, ownerDocument: SpatialDocumentImpl) {
  const parser = new XSMLParser();
  parser.parseIntoDocument(markup, ownerDocument);
}
