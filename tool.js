const util = require('util');
const axios = require('axios');
let APIKEY = 'd3dde9db675149ec100b63c876dbfd68'
const { Query, UpdateData } = require('./mysql.js');
const { DebugObject, logger } = require('./logger.js');
const { GetMobDivineInfo, GetMobYMLInfo, CrawlMobDivineYML, MobDB, MobYMLLoadAll } = require('./Mob.js');
const { ItemDB } = require('./Item.js');

const yaml = require('js-yaml');
const fs = require('fs');

//////////////////////////////////////////////////////
let server = [
  'iRO',
  'jRO',
  'kROZ',
  'kROM',
  'twRO',
  'cRO',
  //'kROZS',
  //'aRO', 
  //'bRO', 
  //'fRO', 
  //'idRO', 
  //'GGH', 
  //'ropEU', 
  //'ropRU', 
  //'thROG', 
  //'iROC',
];
//////////////////////////////////////////////////////

(async () => {

  /*
  
  */
  let listmob = [
    1001, 1002, 1004, 1005, 1007, 1008, 1009, 1010,
    1011, 1012, 1013, 1014, 1015, 1016, 1018, 1019,
    1020, 1023, 1024, 1025, 1026, 1028, 1029, 1030,
    1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038,
    1039, 1040, 1041, 1042, 1044, 1045, 1046, 1047, 1048,
    1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057,
    1058, 1059
  ];
  let MOBDB = await MobDB();
  //console.log(util.inspect(MOBDB,{depth:1, colors: true}));
  logger.debug(`MobDB count: ${MOBDB.length}`);
  for await (const item of listmob) {
    DebugObject(MOBDB.find(o => typeof o != undefined && o.Id == item));
    //if (await MOBDB.find(o => o.Id == item)) continue;
    /*
    logger.info(`===============================================`)
    logger.info(`Crawl info for MobID: ${item}`);
    let mobdata = await CrawlMobDivineYML(item);
    if (mobdata.result) {
      //DebugObject(mobdata);
      let path = '/root/rathena/GameServer/db/import/mob_db_2.yml';
      let data = await MobYMLLoadAll(path);
      //DebugObject(data);
      let mobfile = {
        Header: {
          Type: "MOB_DB",
          Version: 3
        },
        Body: [...data]
      }
      mobfile.Body.push(mobdata.Parsed);

      fs.writeFile(path, yaml.dump(mobfile), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    */
  }


})();





