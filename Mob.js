const util = require('util');
const axios = require('axios');
let APIKEY = 'd3dde9db675149ec100b63c876dbfd68'
const yaml = require('js-yaml');
const fs = require('fs');
const { Query, UpdateData } = require('./mysql.js');
const { DebugObject, logger } = require('./logger.js');
const { ItemDB } = require('./Item.js');

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
const MobYMLLoadAll = async function (path, recursive = false) {
  //logger.info(`==============================================================`);
  //logger.info(`Check '${path}'`);
  let doc = yaml.load(fs.readFileSync(path, 'utf8'));
  let res = [];
  if (doc && typeof doc.Body != undefined) {
    //console.log(`Found Body from '${path}'`);
    res = res.concat(doc.Body);
  }
  if (recursive && doc && doc.Footer && doc.Footer.Imports) {
    //console.log(util.inspect(doc.Footer.Imports, { depth: 1, colors: true }));
    for await (const item of doc.Footer.Imports) {
      if (!item.Mode || item.Mode == 'Renewal' || item.Mode == undefined || item.Mode == '') {
        //logger.debug(item.Path);
        //console.log(item.Mode);
        res = res.concat(await MobYMLLoadAll(`/root/rathena/GameServer/${item.Path}`, true));
      }
    }
  }
  return res;
};

module.exports = {
  MobDB: async function (mobid = 0, mobname = "") {
    if (mobid == 0 && mobname == "") return await MobYMLLoadAll('/root/rathena/GameServer/db/mob_db.yml', true);
    if (mobid > 0 && mobname == "") return (await MobYMLLoadAll('/root/rathena/GameServer/db/mob_db.yml', true)).find(o => o.Id == mobid);
    if (mobid == 0 && mobname != "") return (await MobYMLLoadAll('/root/rathena/GameServer/db/mob_db.yml', true)).find(o => o.AegisName == mobname);
    return {};
  },
  MobYMLLoadAll: MobYMLLoadAll,
  CrawlMobDivineYML: async function CrawlMobDivineYML(mobid) {
    let RaceList = [
      'Formless',
      'Undead',
      'Brute',
      'Plant',
      'Insect',
      'Fish',
      'Demon',
      'Demihuman',
      'Angel',
      'Dragon'
    ];
    let ElementList = [
      'Neutral',
      'Water',
      'Earth',
      'Fire',
      'Wind',
      'Poison',
      'Holy',
      'Dark',
      'Ghost',
      'Undead'
    ];
    let SizeList = ['Small', 'Medium', 'Large'];
    let res = await axios.get(`https://divine-pride.net/api/database/Monster/${mobid}?apiKey=${APIKEY}&server=${server}`, {
      headers: {
        //'Accept-Language':'ko-KR'
      }
    })
      .then(async res => {
        let data = res.data;
        let info = {};
        info.result = true;
        info.Divine = data;
        let result = info.Parsed = {};

        result.Id = data.id;
        result.AegisName = data.dbname;                  //Server name to reference the monster in scripts and lookups, should use no spaces.

        //Name in English.
        if (data.name) result.Name = data.name;
        //Name in Japanese. (Default: 'Name' value)
        //if (data.name) result.JapaneseName = data.name;
        //Level. (Default: 1)
        if (data.stats.level) result.Level = data.stats.level;
        //Total HP. (Default: 1)
        if (data.stats.health) result.Hp = data.stats.health;
        //Total SP. (Default: 1)
        //if (data.stats.sp) result.Sp = data.stats.sp;
        //Base experience gained. (Default: 0)
        if (data.stats.baseExperience) result.BaseExp = data.stats.baseExperience;
        //Job experience gained. (Default: 0)
        if (data.stats.jobExperience) result.JobExp = data.stats.jobExperience;
        //MVP experience gained. (Default: 0)
        if (data.stats.mvp == 1) result.MvpExp = data.stats.baseExperience * 0.5;
        //Minimum attack in pre- renewal and base attack in renewal. (Default: 0)
        if (data.stats.atk1) result.Attack = data.stats.atk1;
        //Maximum attack in pre - renewal and base magic attack in renewal. (Default: 0)
        if (data.stats.atk2) result.Attack2 = data.stats.atk2;
        //Physical defense of the monster, reduces melee and ranged physical attack / skill damage. (Default: 0)
        if (data.stats.defense) result.Defense = data.stats.defense;
        //Magic defense of the monster, reduces magical skill damage. (Default: 0)
        if (data.stats.magicDefense) result.MagicDefense = data.stats.magicDefense;
        //Physical resistance of the monster, reduces melee and ranged physical attack / skill damage. (Default: 0)
        if (data.stats.res) result.Resistance = data.stats.res;
        //Magic resistance of the monster, reduces magical skill damage. (Default: 0)
        if (data.stats.mres) result.MagicResistance = data.stats.mres;
        //Strength which affects attack. (Default: 1)
        if (data.stats.str) result.Str = data.stats.str;
        //Agility which affects flee. (Default: 1)
        if (data.stats.agi) result.Agi = data.stats.agi;
        //Vitality which affects defense. (Default: 1)
        if (data.stats.vit) result.Vit = data.stats.vit;
        //Intelligence which affects magic attack. (Default: 1)
        if (data.stats.int) result.Int = data.stats.int;
        //Dexterity which affects hit rate. (Default: 1)
        if (data.stats.dex) result.Dex = data.stats.dex;
        //Luck which affects perfect dodge / lucky flee / perfect flee / lucky dodge rate. (Default: 1)
        if (data.stats.luk) result.Luk = data.stats.luk;
        //Attack range. (Default: 0)
        if (data.stats.attackRange) result.AttackRange = data.stats.attackRange;
        //Skill cast range. (Default: 0)
        if (data.stats.aggroRange) result.SkillRange = data.stats.aggroRange;
        //Chase range. (Default: 0)
        if (data.stats.escapeRange) result.ChaseRange = data.stats.escapeRange;
        //Size. (Default: Small)
        if (0 <= data.stats.scale && data.stats.scale <= SizeList.length - 1) result.Size = SizeList[data.stats.scale];
        //Race. (Default: Formless)
        if (0 <= data.stats.race && data.stats.race <= RaceList.length - 1) result.Race = RaceList[data.stats.race];
        //List of secondary groups the monster may be part of. (Optional)
        //result.RaceGroups = {};                          

        if (data.stats.element) {
          let eleType = (data.stats.element % 10);
          let eleLevel = Math.floor((data.stats.element / 20));
          if (ElementList[eleType]) {
            //Element. (Default: Neutral)
            result.Element = ElementList[eleType];
            //Level of element. (Default: 1)
            result.ElementLevel = eleLevel;
          }
        }

        //Walk speed. (Default: DEFAULT_WALK_SPEED)
        if (data.stats.movementSpeed) result.WalkSpeed = data.stats.movementSpeed;
        //Attack speed. (Default: 0)
        if (data.stats.rechargeTime) result.AttackDelay = data.stats.rechargeTime;
        //Attack animation speed. (Default: 0)
        if (data.stats.attackSpeed) result.AttackMotion = data.stats.attackSpeed;
        //Client attack speed. (Default: AttackMotion)
        //result.ClientAttackMotion;
        //Damage animation speed. (Default: 0)
        if (data.stats.attackedSpeed) result.DamageMotion = data.stats.attackedSpeed;
        //Rate at which the monster will receive incoming damage. (Default: 100)
        if (data.stats.mvp == 1) result.DamageTaken = 10;

        let listAI = [
          0x0000,
          //01: 0x0081 (passive)
          0x0081,
          //02: 0x0083 (passive, looter)
          0x0083,
          //03: 0x1089 (passive, assist and change-target melee)
          0x1089,
          //04: 0x3885 (angry, change-target melee/chase)
          0x3885,
          //05: 0x2085 (aggressive, change-target chase)
          0x2085,
          //06: 0x0000 (passive, immobile, can't attack) [plants]
          0x0000,
          //07: 0x108B (passive, looter, assist, change-target melee)
          0x108B,
          //08: 0x7085 (aggressive, change-target melee/chase, target weak enemies)
          0x7085,
          //09: 0x3095 (aggressive, change-target melee/chase, cast sensor idle) [Guardian]
          0x3095,
          //10: 0x0084 (aggressive, immobile)
          0x0084,
          //11: 0x0084 (aggressive, immobile) [Guardian]
          0x0084,
          //12: 0x2085 (aggressive, change-target chase) [Guardian]
          0x2085,
          //13: 0x308D (aggressive, change-target melee/chase, assist)
          0x308D,
          0x0000,
          0x0000,
          0x0000,
          //17: 0x0091 (passive, cast sensor idle)
          0x0091,
          0x0000,
          //19: 0x3095 (aggressive, change-target melee/chase, cast sensor idle)
          0x3095,
          //20: 0x3295 (aggressive, change-target melee/chase, cast sensor idle/chase)
          0x3295,
          //21: 0x3695 (aggressive, change-target melee/chase, cast sensor idle/chase, chase-change target)
          0x3695,
          0x0000,
          0x0000,
          //24: 0x00A1 (passive, does not walk randomly) [Slave]
          0x00A1,
          //25: 0x0001 (passive, can't attack) [Pet]
          0x0001,
          //26: 0xB695 (aggressive, change-target melee/chase, cast sensor idle/chase, chase-change target, random target)
          0xB695,
          //27: 0x8084 (aggressive, immobile, random target)
          0x8084
        ]
        //Aegis monster type AI behavior. (Default: 06)
        if (data.stats.ai) {
          result.Ai = data.stats.ai.split("_")[2];
        }
        //Aegis monster class. (Default: Normal)
        if (data.stats.mvp == 1) result.Class = 'Boss';
        //List of unique behavior not defined by AI, Class, or Attribute. (Optional)
        if (data.stats.mvp == 1) {
          if (!result.Modes) result.Modes = {};
          result.Modes.Mvp = true;
        };
        if (data.stats.ai) {

          //MD_CANMOVE            | 0x0000001 | 1             CanMove
          //if ((listAI[parseInt(data.stats.ai.split("_")[2])] & 0x0000001) == 0x0000001) { if (!result.Modes) result.Modes = {}; result.Modes }
          //MD_LOOTER             | 0x0000002 | 2             Looter
          //MD_AGGRESSIVE         | 0x0000004 | 4             Aggressive
          //MD_ASSIST             | 0x0000008 | 8             Assist
          //MD_CASTSENSORIDLE     | 0x0000010 | 16            CastSensorIdle
          //MD_NORANDOMWALK       | 0x0000020 | 32            NoRandomWalk
          //MD_NOCAST             | 0x0000040 | 64            NoCast
          //MD_CANATTACK          | 0x0000080 | 128           CanAttack
          //FREE                  | 0x0000100 | 256     
          //MD_CASTSENSORCHASE    | 0x0000200 | 512           CastSensorChase
          //MD_CHANGECHASE        | 0x0000400 | 1024          ChangeChase
          //MD_ANGRY              | 0x0000800 | 2048          Angry
          //MD_CHANGETARGETMELEE  | 0x0001000 | 4096          ChangeTargetMelee
          //MD_CHANGETARGETCHASE  | 0x0002000 | 8192          ChangeTargetChase
          //MD_TARGETWEAK         | 0x0004000 | 16384         TargetWeak
          //MD_RANDOMTARGET       | 0x0008000 | 32768         RandomTarget
          //---------------------------------------------
          //MD_IGNOREMELEE        | 0x0010000 | 65536         IgnoreMelee
          //MD_IGNOREMAGIC        | 0x0020000 | 131072        IgnoreMagic
          //MD_IGNORERANGED       | 0x0040000 | 262144        IgnoreRanged
          //MD_MVP                | 0x0080000 | 524288        Mvp
          //MD_IGNOREMISC         | 0x0100000 | 1048576       IgnoreMisc
          //MD_KNOCKBACKIMMUNE    | 0x0200000 | 2097152       KnockBackImmune
          //MD_TELEPORTBLOCK      | 0x0400000 | 4194304       TeleportBlock
          //FREE                  | 0x0800000 | 8388608 
          //---------------------------------------------
          //MD_FIXEDITEMDROP      | 0x1000000 | 16777216      FixedItemDrop
          //MD_DETECTOR           | 0x2000000 | 33554432      Detector
          //MD_STATUSIMMUNE       | 0x4000000 | 67108864      StatusImmune
          //MD_SKILLIMMUNE        | 0x8000000 | 134217728     SkillImmune
        };

        let ITEMDB = await ItemDB();
        let mvpdrops = [];
        data.mvpdrops.forEach(element => {
          ITEMINFO = ITEMDB.find(o => o.Id == element.itemId);
          let tmp = { Item: ITEMINFO.AegisName, Rate: element.chance > 0 ? element.chance : 1 };
          mvpdrops.push(tmp);
        });
        if (mvpdrops.length > 0) result.MvpDrops = mvpdrops;
        /*
        {               //List of possible MVP prize items. Max of MAX_MVP_DROP. (Optional)
          Item,                //Item name.
          Rate,                //Drop rate of item. (Default: 1)
          RandomOptionGroup,   //Random Option Group applied to item on drop. (Default: None)
          Index
        },               //Index used for overwriting item. (Optional)
        */

        let drops = [];

        data.drops.forEach(element => {
          ITEMINFO = ITEMDB.find(o => o.Id == element.itemId);
          let tmp = { Item: ITEMINFO.AegisName, Rate: element.chance > 0 ? element.chance : 1 };
          if (element.stealProtected) tmp.StealProtected = true;
          drops.push(tmp);
        });
        if (drops.length > 0) result.Drops = drops;
        /*
        {                 //List of possible normal item drops. Max of MAX_MOB_DROP. (Optional)
         Item,                //Item name.
           Rate,                //Drop rate of item. (Default: 1)
           StealProtected,      //If the item is shielded from TF_STEAL. (Default: false)
           RandomOptionGroup,   //Random Option Group applied to item on drop. (Default: None)
           Index
         }               //Index used for overwriting item. (Optional)
         */
        ;
        return info;
      })
    return res;
  },

  GetMobDivineInfo: async function (mobid) {
    let res = await axios.get(`https://divine-pride.net/api/database/Monster/${mobid}?apiKey=${APIKEY}&server=${server}`, {
      headers: {
        //'Accept-Language':'ko-KR'
      }
    })
      .then(res => {
        let data = res.data;
        return data;
      })
    return {
      result: true,
      data: res
    };
  },
  GetMobYMLInfo: async function (mobid) {
    try {
      //let doc = yaml.load(fs.readFileSync('/root/rathena/GameServer/db/mob_db.yml', 'utf8'));
      let doc = yaml.load(fs.readFileSync('/root/rathena/GameServer/db/re/mob_db.yml', 'utf8'));
      //let doc = yaml.load(fs.readFileSync('/root/rathena/GameServer/db/import/mob_db.yml', 'utf8'));
      //console.log(util.inspect(doc.Body, {depth: 1, colors: true}));

      //DebugObject(doc.Body);
      let item = doc.Body.find(i => i.Id === mobid)
      if (item) {
        DebugObject(item);
        return {
          result: true,
          data: item
        }
      } else {
        return {
          result: false
        }
      }

    } catch (e) {
      logger.error(e);
      return {
        result: false
      }
    }
  },
  GetAllMobYMLInfo: async function () {
    try {
      //let doc = yaml.load(fs.readFileSync('/root/rathena/GameServer/db/mob_db.yml', 'utf8'));
      let doc = yaml.load(fs.readFileSync('/root/rathena/GameServer/db/re/mob_db.yml', 'utf8'));
      //let doc = yaml.load(fs.readFileSync('/root/rathena/GameServer/db/import/mob_db.yml', 'utf8'));
      //console.log(util.inspect(doc.Body, {depth: 1, colors: true}));

      //DebugObject(doc.Body);

      return {
        result: true,
        data: doc.Body
      }

    } catch (e) {
      logger.error(e);
      return {
        result: false
      }
    }
  }
}
