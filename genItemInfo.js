var fs = require('fs');
var glob = require('glob');
var util = require('util');
var { Travels } = require('./Files.js');
const axios = require('axios');
var https = require('https');
const { DebugObject, logger } = require('./logger.js');

const APIKEY = 'd3dde9db675149ec100b63c876dbfd68';

(async () => {

    let json = await axios.get(`https://thien-phong.com/rojor/REST.php?action=getItemDB&server=2&file=json`, {
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    });

    //DebugObject(json.data,1);
    let count = json.data.length;
    count = 20;
    for (let i = 0; i < count; i++) {
        //console.log(json.data[i]);
        let server = "iRO";
        let res = await axios.get(`https://divine-pride.net/api/database/Item/${json.data[i].Id}?apiKey=${APIKEY}&server=${server}`, {
            headers: {
                //'Accept-Language':'ko-KR'
                'Accept-Language': 'en-US'
            }
        });
        let data = res.data;

        if (data.aegisName != json.data[i].AegisName) {
            logger.error("Id: "+json.data[i].Id+" AegisName: "+json.data[i].AegisName);
            continue;
        }
        if (data.description == '' || typeof data.description == 'undefined') {
            logger.error("Id: "+json.data[i].Id+" no Desc");
            continue;
        }
        if ((data.resName == '' || typeof data.resName == 'undefined') && (data.unidResName == '' || typeof data.unidResName == 'undefined')) {
            logger.error('Id: '+json.data[i].Id+' no Res');
            continue;
        }
        logger.info('Id: '+json.data[i].Id);
        /*
        console.log(data.aegisName);
        console.log(data.name);
        console.log(data.unidName);
        console.log(data.resName);
        console.log(data.unidResName);
        console.log(data.description);
        console.log(data.unidDescription);
        */



        await new Promise(r => setTimeout(r, 200));
    }

    return;

})();