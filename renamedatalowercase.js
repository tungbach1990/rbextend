var fs = require('fs');
var glob = require('glob');
var util = require('util');
var { Travels } = require('./Files.js');

// print process.argv
let ext = '',
    createLink = false;
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    // --ext=Spr
    if (val.match(/--ext/g)) ext = val.split('=')[1];
    if (ext.split("|").length > 1) {
        ext = ext.split('|');
    } else {
        ext = [ext];
    }
    if (val.match(/--link/g)) createLink = true;
  });

if (ext == '') return;

(async () => {
    var path = "/data/rojor/robrowser/client/data/";
    ext.forEach(ext=>{
        Travels({
            path: path, recursive: true, filterExt: ext ?? "bmp", callback: (path, item) => {
                if (match = item.match(/([A-Z]+)/g),match) {

                    console.log(path, item);
                    let newItem = item;
                    match.forEach(element => {
                        newItem = newItem.replace(element,element.toLowerCase());
                    });
                    console.log(match, newItem);
                    fs.copyFileSync(path + item, path + newItem);
                }
            }
        });
    })
})();