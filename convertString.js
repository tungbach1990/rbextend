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

const word = [
    // Race
    ['인간족','ÀÎ°£Á·','Human'],
    // Class
    ['초보자','ÃÊº¸ÀÚ','Beginner'],    
    ['궁수','±Ã¼ö','Archer'],    
    ['헌터','ÇåÅÍ','Hunter'],    
    ['레인져','·¹ÀÎÁ®','Ranger'],    
    // Weapon
    ['활','È°','Bow'],
    ['단검','´Ü°Ë','Dagger'],
    // Sex
    ['남','³²','Male'],
    ['여','¿©','Female'],
    // Other
    ['워터','¿öÅÍ','Water'],
    ['검광','°Ë±¤','Detection'],
]

switch (cmd) {
    case 'decode':

        let trans = '';
        for (const W of word) {
            if (str.includes(W[0])) {
                console.log(`Found ${W[0]} : ${W[2]}`);
                trans = trans==''?str.replaceAll(W[0],W[2]):trans.replaceAll(W[0],W[2]);
            }
            if (str.includes(W[1])) {
                console.log(`Found ${W[1]} : ${W[2]}`);                
                trans = trans==''?str.replaceAll(W[1],W[2]):trans.replaceAll(W[1],W[2]);
            }
        }
        if (trans != '') console.log(`Translated: ${trans}`);

        console.log('Convert Unicode to AltCode:');
        console.log(decode(str).toLowerCase());
        console.log(decode(str).toUpperCase());
        console.log(encode(decode(str)));

        break;
    case 'encode':      // \xBE\xEE\xBC\xBC\xBD\xC5
        console.log('Convert Alt Code to Unicode:');
        console.log(encode(str));
        console.log(decode(encode(str)).toUpperCase())
        console.log(decode(encode(str)).toLowerCase());
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

