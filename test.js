const fetch = require('node-fetch');
const https = require('https');

const ConvertJobName = function (string) {
    if (string == "Mage") string = "Magician";
    string = string.replace("_High", "_H");
    return string.toUpperCase();
}

function Test() {
    let SkillTreeViewDB = {};
    return new Promise(async (rej, res)=>{
        let result = await fetch("https://thien-phong.com/rojor/REST.php?action=getSkillTree&server=2", {
            agent: new https.Agent({
                rejectUnauthorized: false
            })
        });
        let data = await result.json();
        //console.log(data);
		//.then(data => data.json())
		//.then(data => {
			//console.log(data.yaml.Body);

			data.yaml.Body.forEach((value, index) => {
				//console.log(value);
				let jobName = value.Job;

				jobName = ConvertJobName(jobName);

				let jobPos = [];
				let jobTree = value.Tree;
				if (jobTree) {
					let startPos = 0;
					jobTree.forEach(item => {
						startPos = item.Pos ?? startPos + 1;
						//jobPos[eval("SK." + item.Name)] = item.Pos ?? startPos;
					});
				}
				let inheritID = 0;
				if (value.Inherit) {
					//console.log(value.Inherit);
					for (const [k, v] of Object.entries(value.Inherit)) {
						//console.log(k, v);
						//if (eval('JobId.' + ConvertJobName(k)) > inheritID) inheritID = eval('JobId.' + ConvertJobName(k));
					}
				}


				SkillTreeViewDB[jobName] = {
					list: value.List ?? 1,
					beforeJob: (inheritID == 0 && jobName == "NOVICE") ? null : inheritID,
					...jobPos
				};
			});

		//}).then(data => {
			//console.log(SkillTreeViewDB);
            res(SkillTreeViewDB);
			//SkillTreeView = SkillTreeViewDB;
		//});
    });
}

console.log(Test());