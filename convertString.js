var fs = require('fs');
var glob = require('glob');
var util = require('util');
const { StringDecoder } = require('node:string_decoder');
const { Buffer } = require('node:buffer');

let str = process.argv[2] || "";
let cmd = 'default';
process.argv.forEach(function (val, index, array) {
    //console.log(index + ': ' + val);
    // --ext=Spr
    if (val.match(/--encode/g)) {
        cmd = 'encode';
        str = val.split('=')[1] || "";
    } else if (val.match(/--decode/g)) {
        cmd = 'decode';
        str = val.split('=')[1] || "";
    } else {
    }
});

function encode(str) {
    return str.split('\\x').map(s => String.fromCharCode(parseInt(s, 16))).join('');
}
function decode(str) {
    return str.split('').map(s => "\\x" + parseInt(s.charCodeAt(0)).toString(16).toUpperCase()).join('')
}

switch (cmd) {
    case 'decode':
        console.log('Convert Unicode to AltCode:', decode(str).toLowerCase(), decode(str).toUpperCase(), encode(decode(str)));
        break;
    case 'encode':      // \xBE\xEE\xBC\xBC\xBD\xC5
        console.log('Convert Alt Code to Unicode:', encode(str), decode(encode(str)).toUpperCase(), decode(encode(str)).toLowerCase());
        break;
    default:
        if (str == "") {
            console.log("Nothing to convert");
            return;
        }
        if (str.split('\\x').length > 1) {
            console.log('Convert Alt Code to Unicode:', encode(str), decode(encode(str)), decode(encode(str)).toLowerCase());
            break;
        } else {
            console.log('Convert Unicode to AltCode:', decode(str).toLowerCase(), decode(str), encode(decode(str)));
        }
        break;
}

