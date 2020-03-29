const hexDict = {0:0, 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:'A', 11:'B', 12:'C', 13:'D', 14:'E', 15:'F'};

export const decimelToHex = (n) => {
    let r;
    let d = n;
    let hexArr = [];
    do {
        r = d % 16;
        d = (d - r) / 16;
        hexArr.push(hexDict[r]);
    } while (d > 16);
    hexArr.push(hexDict[d]);
    hexNum = hexArr.reverse().join('');
    return hexNum;
}