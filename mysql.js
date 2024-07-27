var mysql = require('mysql');
//////////////////////////////////////////////////////
const mysqlInfo = {
    host: "localhost",
    user: "rojor",
    password: "rojor789521",
    database: "rojor_game"
}
/////////////////////////////////////////////////////
async function Query(sql) {
    var con = mysql.createConnection(mysqlInfo);
    return new Promise((res, rej) => {
        con.connect(function (err) {
            if (err) rej(err);
            //console.log("Connected!");
            con.query(sql, function (err, result) {
                if (err) rej(err);
                con.end((err) => {
                    if (err) rej(err);
                });
                res(result);
            });
        });
    });
}

module.exports = {
    Query: function (sql) {
        var con = mysql.createConnection(mysqlInfo);
        return new Promise((res, rej) => {
            con.connect(function (err) {
                if (err) rej(err);
                //console.log("Connected!");
                con.query(sql, function (err, result) {
                    if (err) rej(err);
                    con.end((err) => {
                        if (err) rej(err);
                    });
                    res(result);
                });
            });
        });
    },
    /////////////////////////////////////////////////////
    UpdateData: async function (table, data) {
        let keylist = [];
        let valuelist = [];

        Object.entries(data.primary).forEach(item => {
            keylist.push("`" + item[0] + "`");
            valuelist.push("'" + item[1] + "'");
        });
        let id = valuelist[0];
        let sql = `INSERT IGNORE INTO \`${table}\` (${keylist.join()}) VALUES (${valuelist.join()})`;
        Query(sql);
        for await (const [key, value] of Object.entries(data.cols)) {
            if (value != null && value != undefined) {
                let sql = `UPDATE \`${table}\` SET \`${key}\`='${value}' WHERE \`id\`=${id} LIMIT 1`;
                Query(sql);
            }
        }
    }
}