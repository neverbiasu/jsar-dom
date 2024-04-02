import { Get_Matrix_Elements } from './DOMMatrixReadOnly';
import DOMMatrixImpl from './DOMMatrix';
export function post_multiply(self: DOMMatrix, other: DOMMatrix): DOMMatrix { 
    const selfElements = Array.from(self[Get_Matrix_Elements]());
    console.log("🦖", selfElements);
    const otherElements = Array.from(other[Get_Matrix_Elements]());
    const resElements = [];
    for(let i = 0; i < 16; i = i + 1) {
        resElements[i] = 0;
        /**左行 * 右列 */
        for(let k = 0; k < 4; k = k + 1) {
            resElements[i] = resElements[i] + Number(selfElements[k * 4 + i % 4]) * Number(otherElements[Math.floor(i / 4) * 4 + k]);
            if (i == 0 || i == 1 || i === 12 || i === 13) {
                // console.log("🦕selfElements * 🐲otherElements =  🦜resElements: ", selfElements[k * 4 + i % 4], "*", otherElements[Math.floor(i / 4) * 4 + k], "=", resElements[i]);
            }
        }
        
    }
    const resMatrix: DOMMatrix = new DOMMatrixImpl(resElements);
    // console.log("🐦", resMatrix);
    return resMatrix;
}

export function pre_multiply(other: DOMMatrix, self: DOMMatrix): DOMMatrix { 
    const selfElements = Array.from(self[Get_Matrix_Elements]);
    const otherElements = Array.from(other[Get_Matrix_Elements]);
    const resElements = [];
    for(let i = 0; i < 16; i = i + 1) {
        resElements[i] = 0;
        for(let k = 0; k < 4; k = k + 1) {
            resElements[i] = resElements[i] + Number(otherElements[Math.floor(i / 4) * 4 + k]) * Number(selfElements[k * 4 + i % 4]);
        }
    }
    const resMatrix: DOMMatrix = new DOMMatrixImpl(resElements);
    return resMatrix;
}

