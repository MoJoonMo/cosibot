
const request = require('request');
const rp = require('request-promise');
const config = require('../../config/config');

async function findOCID(msg:string) {
    let m = msg.split(" ");
    const apikey= await config.getApiKey();

    const user_options = {
        // uri: "https://www.naver.com/",
        uri: "https://open.api.nexon.com/maplestory/v1/id",
        headers: {
          'x-nxopen-api-key': apikey,
        },
        qs:{
            character_name : m[1]
        }
    };

    let ret = await rp(user_options);
    return JSON.parse(ret).ocid;
    
}

async function question(msg:string){
    let m = msg.split(" "); //닉네임, 날짜, 요청명
    const ocid = await findOCID(">ocid " + m[0]);
    const date = m[1];
    const reqName= m[2];
    const rq = ocid + " " + date + " " +reqName;
    console.log("question rq : " + rq);
    return await callAPI(rq);
}

async function callAPI(msg:string){
    let m = msg.split(" "); //ocid, 날짜, 요청명
    const ocid = m[0]
    const date = m[1];
    let kind2 : string = m[2];

    let qs = {};
    if (kind2 == 'UserSkill6'){ // 뒤에 Available values : 0, 1, 1.5, 2, 2.5, 3, 4, hyperpassive, hyperactive, 5, 6
        qs = {
            ocid : ocid,
            date : date,
            character_skill_grade : 6
        };
        console.log("callAPI qs" + ocid + " " + date + " " + kind2 + " 6");
    }else if(kind2 == 'RankingDojang'){
        qs = {
            ocid : ocid,
            date : date,
            difficulty : 1
        };
        console.log("callAPI qs" + ocid + " " + date + " " + kind2 + " 1");
    }else {
        qs = {
            ocid : ocid,
            date : date
        };
        console.log("callAPI qs" + ocid + " " + date + " " + kind2);
    }

    

    const urlList : {[key : string] : string }  = {  "basicUser" : "https://open.api.nexon.com/maplestory/v1/character/basic"
                                                    ,"UserSkill6" : "https://open.api.nexon.com/maplestory/v1/character/skill"
                                                    ,"RankingOverall" : "https://open.api.nexon.com/maplestory/v1/ranking/overall"
                                                    ,"RankingUnion" : "https://open.api.nexon.com/maplestory/v1/ranking/union"
                                                    //,"RankingGuild" : "https://open.api.nexon.com/maplestory/v1/ranking/guild"
                                                    ,"RankingDojang" : "https://open.api.nexon.com/maplestory/v1/ranking/dojang"
                                                    ,"RankingTheSeed" : "https://open.api.nexon.com/maplestory/v1/ranking/theseed"
                                                    ,"RankingAchievement" : "https://open.api.nexon.com/maplestory/v1/ranking/achievement"
                                                    ,"charcaterItem" : "https://open.api.nexon.com/maplestory/v1/character/item-equipment"
                                                    ,"characterStat" : "https://open.api.nexon.com/maplestory/v1/character/stat"
                                                };
    const url = urlList[kind2]; 

    const apikey= await config.getApiKey();
    
    const options = {
        uri: url,
        headers: {
          'x-nxopen-api-key': apikey,
        },
        qs:qs
    };

    let ret = await rp(options).then().catch(
        //console.log("callAPI 에러 : " + ocid + " " + date + " " + kind2)
    );
    //return JSON.parse(ret).ocid;
    return ret;

}

export {findOCID,callAPI,question};