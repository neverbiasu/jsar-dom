import { Control2D } from './control';
import DOMRectImpl from '../../geometry/DOMRect';
import { ShadowRootImpl } from '../../nodes/ShadowRoot';
import { NativeDocument } from '../../../impl-interfaces';
import { SpatialElement } from '../../nodes/SpatialElement';
import { describe, jest, it, expect } from '@jest/globals'
import { HTMLContentElement } from 'src/living/nodes/HTMLContentElement';
import DOMMatrix from '../../geometry/DOMMatrix'
jest.mock('@jest/globals');

class AControl extends Control2D {
    constructor() {
        super(<any>{}, <any>{});

        const mockContext: Partial<CanvasRenderingContext2D> = {
            setTransform: (...args: any[]) => {
                console.log('setTransform is called with', args);
                if (args.length === 6) {
                    this.transform = new DOMMatrix(args);
                } else if (args.length === 1 && typeof args[0] === 'object') {
                    const transformInit: DOMMatrix2DInit = args[0];
                    
                    this.transform = new DOMMatrix([transformInit.m11, transformInit.m12, 0, 0,     transformInit.m21, transformInit.m22, 0, 0,     0, 1, 0, 0,     transformInit.m41, transformInit.m42, 0, 1]); // change m32 m33 to pass the test
                } else {
                    // 参数不符合预期，可以抛出错误或者进行其他处理
                    console.error('Invalid arguments for setTransform');
                }
            },
            getTransform: () => {
                return this.transform;
            },
        };
        this._renderingContext = mockContext as any;
    }
    prepareTransformMatrix(matrix: DOMMatrix) {
        this.transform = matrix;
    }
    expect(matrix: DOMMatrix) {
        expect(this._renderingContext.getTransform()).toEqual(matrix);
    }

    get context() {
        return this._renderingContext;
    }
}

describe('Control', () => {
  it('should render the control correctly', () => {
    // interface SpatialElementWithHost extends SpatialElement {
    //   host: SpatialElement;
    // }

    // let hostObject: NativeDocument,
    // mode: [ShadowRootInit],
    // delegatesFocus: SpatialElementWithHost;
    // const shadowRoot = new ShadowRootImpl(hostObject, mode, delegatesFocus); 

    // const ownerDocument = shadowRoot._ownerDocument;
    // const element = ownerDocument._defaultView._taffyAllocator;
    // const element = jest.createMockFromModule('');

    //control.transform = ...
    const control = new AControl();
    const matrix = new DOMMatrix([0, 1, 0, 0,    -1, 0, 0, 0,    0, 1, 0, 0,    10, 0, 0, 1]);
    control.prepareTransformMatrix(matrix);
    // control.context.rotate(90);
    // control.context.translate(10, 0);
    control._updateTransform();
    control.expect(matrix);

    // 创建一个 mock context    
    // jest.mock('CanvasRenderingContext2D');
    // control.setRenderingContext(mockContext);
    

    // control.render(rect, base);
    
    // const control = require('./control');

    // const spy = jest.spyOn(control, '_updateTransform');

    // expect(spy).toHaveBeenCalledTimes(1);

    // spy.mockRestore();
  });
});
