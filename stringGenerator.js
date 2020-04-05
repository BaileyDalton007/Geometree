const hexDict = {0:'0', 1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7', 8:'8', 9:'9', 10:'A', 11:'B', 12:'C', 13:'D', 14:'E', 15:'F'};
const decDict = {'0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, 'A':10, 'B':11, 'C':12, 'D':13, 'E':14, 'F':15};


const decimalToHex = (n) => {
    let r;
    let hexArr = [];
    do {
        r = n % 16;
        n = (n - r) / 16;
        hexArr.push(hexDict[r]);
    } while (n > 16);
    hexArr.push(hexDict[n]);
    if(hexArr.length < 1) {hexArr.push('0')};
    if(hexArr.length < 3) {hexArr.push('0')};
    const hexNum = hexArr.reverse().join('');
    return hexNum;
}

export const hexToDecimal = (n) => {
    const numArr = Array.from(n);
    let y = [];
    for (let i = 0; i < 3; i++) {
        let x = decDict[numArr[i]] * Math.pow(16, numArr.length - (i + 1));
        y.push(x);
    }
    const decNum = y.reduce((a, b) => a + b, 0);
    return decNum;
}

export const savePoints = (pointArr) => {
    let d = [];
    for (let i = 0; i < pointArr.length; i++) {
        const p = pointArr[i];
        //let posA = [decimalToHex((p.x)), decimalToHex((p.y))];
        let posA = [decimalToHex(Math.round(p.x)), decimalToHex(Math.round(p.y))];
        let pos = posA.join('');
        d.push(pos);
    }
    let data = d.join('');
    let adata = data + '|'
    return adata;
}

export const saveLines = (lineArr) => {
    let d = [];
    for (let i = 0; i < lineArr.length; i++) {
        const line = lineArr[i];
        let s = line.startDotIndex.toString().length == 2 ? line.startDotIndex : "0" + line.startDotIndex
        let e = line.endDotIndex.toString().length == 2 ? line.endDotIndex : "0" + line.endDotIndex

        let posA = [s, e];
        let pos = posA.join('')
        d.push(pos);
    }
    let data = d.join('');
    return data;
}

export const saveCircles = (cirArr) => {
    let d = [];
    for (let i = 0; i < cirArr.length; i++) {
        const cir = cirArr[i];
        let c = cir.centerIndex.toString().length == 2 ? cir.centerIndex : "0" + cir.centerIndex
        let r = cir.radiusIndex.toString().length == 2 ? cir.radiusIndex : "0" + cir.radiusIndex
        let posA = [c, r];
        let pos = posA.join('')
        d.push(pos);
    }
    let data = d.join('');
    return data;
}