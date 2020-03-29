const hexDict = {0:'0', 1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7', 8:'8', 9:'9', 10:'A', 11:'B', 12:'C', 13:'D', 14:'E', 15:'F'};
const decDict = {'0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, 'A':10, 'B':11, 'C':12, 'D':13, 'E':14, 'F':15};


export const decimalToHex = (n) => {
    let r;
    let hexArr = [];
    do {
        r = n % 16;
        n = (n - r) / 16;
        hexArr.push(hexDict[r]);
    } while (n > 16);
    hexArr.push(hexDict[n]);
    if (hexArr.length < 3) {hexArr.push(0)};
    const hexNum = hexArr.reverse().join('');
    return hexNum;
}

export const hexToDecimal = (n) => {
    const numArr = Array.from(n);
    let y = [];
    for (let i = 0; i < numArr.length; i++) {
        let x = decDict[numArr[i]] * Math.pow(16, numArr.length - (i+1));
        y.push(x);
    const decNum = y.reduce((a, b) => a + b, 0);
    return decNum;
    }
}