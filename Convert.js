const util = require('util');
const axios = require('axios');
//let APIKEY = 'd3dde9db675149ec100b63c876dbfd68'
const { Query, UpdateData } = require('./mysql.js');
const { DebugObject, logger } = require('./logger.js');
const { GetMobDivineInfo, GetMobYMLInfo, CrawlMobDivineYML, MobDB, MobYMLLoadAll } = require('./Mob.js');
const { ItemDB } = require('./Item.js');
const { Travels } = require('./Files.js');

//const yaml = require('js-yaml');
const fs = require('fs');

// Convert tất cả .Spr >>> .spr
/*
Travels({
    path: "/var/www/html/rojor/robrowser/client/data/",
    recursive: true,
    filterExt: "Spr",
    filterName: "",
    callback: (path, item) => {
        //console.log(path + item);
        let newItem = item.split(".")[0] + "." + item.split(".")[1].toLowerCase();

        fs.rename(path + item, path + newItem, () => {
            console.log("Done!!!");
        });
    }
})
*/

// Convert tên file viết hoa sang viết thường
// Thường xử lý spr|act
Travels({
    path: "/var/www/html/rojor/robrowser/client/data/",
    recursive: true,
    filterExt: "act",
    filterName: "",
    callback: (path, item) => {
        let namestring = item.split(".")[0].split("");
        let boolcheck = false;
        namestring.forEach((char, index) => {
            let charcheck = char.search(/[A-Z]/g);
            if (charcheck >= 0) {
                boolcheck = true;
                namestring[index] = namestring[index].toLowerCase();
            }
        });
        let newItem = namestring.join("") + "." + item.split(".")[1];
        if (boolcheck) {
            fs.rename(path + item, path + newItem, () => {
                logger.info(item + " >>> " + newItem);
            });

        }
    }
})