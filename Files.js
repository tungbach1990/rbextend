const util = require('util');
const axios = require('axios');
let APIKEY = 'd3dde9db675149ec100b63c876dbfd68'
const { Query, UpdateData } = require('./mysql.js');
const { DebugObject, logger } = require('./logger.js');
const { GetMobDivineInfo, GetMobYMLInfo, CrawlMobDivineYML, MobDB, MobYMLLoadAll } = require('./Mob.js');
const { ItemDB } = require('./Item.js');

const yaml = require('js-yaml');
const fs = require('fs');
const { isWebAssemblyCompiledModule } = require('util/support/types.js');


function Travels({ path, recursive = false, filterExt = "", filterName = "", callback }) {
    //console.log(path);
    fs.readdir(path, (err, list) => {
        if (err) throw err;
        if (list.length <= 0) return;
        //console.log(list);
        list.forEach(item => {
            if (fs.lstatSync(path + item).isDirectory()) {
                if (recursive) Travels({path: path + item + "/", recursive: recursive, filterExt: filterExt, filterName: filterName, callback: callback});
            } else {
                let filenamePart = item.split(".");
                if (filterExt.length > 0 && filenamePart[1] != filterExt) {
                //if (filterExt.length > 0 && !filterExt.split("|").includes(filenamePart[1])) {
                    return;
                }
                if (filterName.length > 0 && filenamePart[0].search(filterName) < 0) {
                    return;
                }
                callback(path, item);
            }
        });
    });
}

module.exports = {
    Travels
}
