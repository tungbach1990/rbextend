const util = require('util');
const axios = require('axios');
let APIKEY = 'd3dde9db675149ec100b63c876dbfd68'
const yaml = require('js-yaml');
const fs = require('fs');
const { Query, UpdateData } = require('./mysql.js');
const { DebugObject, logger } = require('./logger.js');

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

async function ItemYMLLoadAll(path, recursive = false) {
  //logger.info(`==============================================================`);
  //logger.info(`Check '${path}'`);
  let doc = yaml.load(fs.readFileSync(path, 'utf8'));
  let res = [];
  if (doc.Body) {
    //console.log(`Found Body from '${path}'`);
    res = res.concat(doc.Body);
  }
  if (recursive && doc.Footer && doc.Footer.Imports) {
    //console.log(util.inspect(doc.Footer.Imports, { depth: 1, colors: true }));
    for await (const item of doc.Footer.Imports) {
      if (!item.Mode || item.Mode == 'Renewal' || item.Mode == undefined || item.Mode == '') {
        //logger.debug(item.Path);
        //console.log(item.Mode);
        res = res.concat(await ItemYMLLoadAll(`/root/rathena/GameServer/${item.Path}`, true));
      }
    }
  }
  return res;
}
module.exports = {
  ItemDB: async function (itemid = 0, itemname = "") {
    if (itemid == 0 && itemname == "") return await ItemYMLLoadAll('/root/rathena/GameServer/db/item_db.yml', true);
    if (itemid > 0 && itemname == "") return (await ItemYMLLoadAll('/root/rathena/GameServer/db/item_db.yml', true)).find(o => o.Id == itemid);
    if (itemid == 0 && itemname != "") return (await ItemYMLLoadAll('/root/rathena/GameServer/db/item_db.yml', true)).find(o => o.AegisName == itemname);
    return {};
  },
  CrawlItemDivineRange: async function (n) {
    for await (const id of [...Array(n).keys()]) {
      let itemid = id + 1001;
      logger.info(`=======================================================`)
      logger.info(`Search info ItemID: ${itemid}`)
      let sql = `SELECT * FROM \`item_db_re\` t1 WHERE t1.\`id\`='${itemid}' UNION SELECT * FROM \`item_db2_re\` t2 WHERE t2.\`id\`='${itemid}'`;
      let query = await Query(sql);
      if (!query || query.length == 0) {
        let ItemInfo = await GetItemInfoAll(itemid);
        if (ItemInfo.result) {
          //DebugObject(ItemInfo);
          logger.info(`Found info --- id: ${ItemInfo.primary.id} nameAegis: ${ItemInfo.primary.name_aegis} from server ${ItemInfo.servername}`);
          UpdateData('item_db2_re', ItemInfo);
        } else {
          logger.warning(`Not found`);
        }
      } else {
        logger.info(`Item đã có thông tin`);
      }
    }
  },
  CrawlItemDivineList: async function (list) {
    for await (const itemid of list) {

      logger.info(`=======================================================`)
      logger.info(`Search info ItemID: ${itemid}`)
      let ItemInfo, ServerName = "";
      for await (const servername of server) {
        ServerName = servername;
        logger.info(`Check server ${servername}`);
        ItemInfo = await GetItemInfo(itemid, servername);
        if (ItemInfo && ItemInfo.result) {
          break;
        }
      }
      if (ItemInfo.result) {
        logger.info(`Found info --- id: ${ItemInfo.primary.id} nameAegis: ${ItemInfo.primary.name_aegis} from server ${ServerName}`);
        UpdateData('item_db2_re', ItemInfo);
      } else {
        logger.warning(`Not found`);
      }
    }
  },
  CrawlDBItemInfoAll: async function (itemid) {
    let ItemInfo = { result: false };
    for await (const servername of server) {
      //logger.info(`Check server ${servername}`);
      ItemInfo = await GetItemInfo(itemid, servername);
      if (ItemInfo && ItemInfo.result) {
        ItemInfo.servername = servername;
        break;
      }
    }
    return ItemInfo;
  },
  CrawlItemInfo: async function (itemid, server = server) {
    //You may set a request parameter called 'server' to select a specific server. Use one of the valid values
    //aRO, bRO, fRO, idRO, iRO, jRO, kROM, kROZ, kROZS, GGH, ropEU, ropRU, thROG, twRO, cRO, iROC
    let res = await axios.get(`https://divine-pride.net/api/database/Item/${itemid}?apiKey=${APIKEY}&server=${server}`, {
      headers: {
        //'Accept-Language':'ko-KR'
      }
    })
      .then(res => {
        let data = res.data;
        return {
          result: true,
          data: res.data,
          primary: {
            id: data.id,
            name_aegis: data.aegisName
          },
          cols: {
            name_english: data.name,

            //type: data.type,
            //subtype: data.subtype,
            //price_buy: data.price_buy,
            //price_sell: data.price_sell,
            weight: data.weight,
            attack: data.attack,
            magic_attack: data.matk,
            defense: data.defense,
            range: data.range,
            slots: data.slots,

            //job_all: data.job_all,
            //job_acolyte: data.job_acolyte,
            //job_alchemist: data.job_alchemist,
            //job_archer: data.job_archer,
            //job_assassin: data.job_assassin,
            //job_barddancer: data.job_barddancer,
            //job_blacksmith: data.job_blacksmith,
            //job_crusader: data.job_crusader,
            //job_gunslinger: data.job_gunslinger,
            //job_hunter: data.job_hunter,
            //job_kagerouoboro: data.job_kagerouoboro,
            //job_knight: data.job_knight,
            //job_mage: data.job_mage,
            //job_merchant: data.job_merchant,
            //job_monk: data.job_monk,
            //job_ninja: data.job_ninja,
            //job_novice: data.job_novice,
            //job_priest: data.job_priest,
            //job_rebellion: data.job_rebellion,
            //job_rogue: data.job_rogue,
            //job_sage: data.job_sage,
            //job_soullinker: data.job_soullinker,
            //job_spirit_handler: data.job_spirit_handler,
            //job_stargladiator: data.job_stargladiator,
            //job_summoner: data.job_summoner,
            //job_supernovice: data.job_supernovice,
            //job_swordman: data.job_swordman,
            //job_taekwon: data.job_taekwon,
            //job_thief: data.job_thief,
            //job_wizard: data.job_wizard,

            //class_all: data.,
            //class_normal: data.,
            //class_upper: data.,
            //class_baby: data.,
            //class_third: data.,
            //class_third_upper: data.,
            //class_third_baby: data.,
            //class_fourth: data.,

            gender: data.gender,

            //location_head_top: data.,
            //location_head_mid: data.,
            //location_head_low: data.,
            //location_armor: data.,
            //location_right_hand: 1,
            //location_left_hand: data.,
            //location_garment: data.,
            //location_shoes: data.,
            //location_right_accessory: data.,
            //location_left_accessory: data.,
            //location_costume_head_top: data.,
            //location_costume_head_mid: data.,
            //location_costume_head_low: data.,
            //location_costume_garment: data.,
            //location_ammo: data.,
            //location_shadow_armor: data.,
            //location_shadow_weapon: data.,
            //location_shadow_shield: data.,
            //location_shadow_shoes: data.,
            //location_shadow_right_accessory: data.,
            //location_shadow_left_accessory: data.,
            //weapon_level: data.,
            //armor_level: data.,

            equip_level_min: data.requiredLevel,
            equip_level_max: data.limitLevel,
            refineable: data.refinable,

            //gradable: data.,
            //view: data.,
            //alias_name: data.,

            //flag_buyingstore: data.,
            //flag_deadbranch: data.,
            //flag_container: data.,
            //flag_uniqueid: data.,
            //flag_bindonequip: data.,
            //flag_dropannounce: data.,
            //flag_noconsume: data.,
            //flag_dropeffect: data.,

            //delay_duration: data.,
            //delay_status: data.,

            //stack_amount: data.,
            //stack_inventory: data.,
            //stack_cart: data.,
            //stack_storage: data.,
            //stack_guildstorage: data.,

            //nouse_override: data.,
            //nouse_sitting: data.,

            //trade_override: data.,
            //trade_nodrop: data.,
            //trade_notrade: data.,
            //trade_tradepartner: data.,
            //trade_nosell: data.,
            //trade_nocart: data.,
            //trade_nostorage: data.,
            //trade_noguildstorage: data.,
            //trade_nomail: data.,
            //trade_noauction: data.,

            //script: data.,
            //equip_script: data.,
            //unequip_script: data.
          }
        };
      })
      .catch(err => {
        if (err.response.status == "404") {
          return { result: false };
        }
      });
    return res;
  }
}
