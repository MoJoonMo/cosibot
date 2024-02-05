"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.question = exports.callAPI = exports.findOCID = void 0;
const request = require('request');
const rp = require('request-promise');
const config = require('../../config/config');
function findOCID(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let m = msg.split(" ");
        const apikey = yield config.getApiKey();
        const user_options = {
            // uri: "https://www.naver.com/",
            uri: "https://open.api.nexon.com/maplestory/v1/id",
            headers: {
                'x-nxopen-api-key': apikey,
            },
            qs: {
                character_name: m[1]
            }
        };
        let ret = yield rp(user_options);
        return JSON.parse(ret).ocid;
    });
}
exports.findOCID = findOCID;
function question(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let m = msg.split(" "); //닉네임, 날짜, 요청명
        const ocid = yield findOCID(">ocid " + m[0]);
        const date = m[1];
        const reqName = m[2];
        const rq = ocid + " " + date + " " + reqName;
        console.log("question rq : " + rq);
        return yield callAPI(rq);
    });
}
exports.question = question;
function callAPI(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let m = msg.split(" "); //ocid, 날짜, 요청명
        const ocid = m[0];
        const date = m[1];
        let kind2 = m[2];
        let qs = {};
        if (kind2 == 'UserSkill6') { // 뒤에 Available values : 0, 1, 1.5, 2, 2.5, 3, 4, hyperpassive, hyperactive, 5, 6
            qs = {
                ocid: ocid,
                date: date,
                character_skill_grade: 6
            };
            console.log("callAPI qs" + ocid + " " + date + " " + kind2 + " 6");
        }
        else if (kind2 == 'RankingDojang') {
            qs = {
                ocid: ocid,
                date: date,
                difficulty: 1
            };
            console.log("callAPI qs" + ocid + " " + date + " " + kind2 + " 1");
        }
        else {
            qs = {
                ocid: ocid,
                date: date
            };
            console.log("callAPI qs" + ocid + " " + date + " " + kind2);
        }
        const urlList = { "basicUser": "https://open.api.nexon.com/maplestory/v1/character/basic",
            "UserSkill6": "https://open.api.nexon.com/maplestory/v1/character/skill",
            "RankingOverall": "https://open.api.nexon.com/maplestory/v1/ranking/overall",
            "RankingUnion": "https://open.api.nexon.com/maplestory/v1/ranking/union"
            //,"RankingGuild" : "https://open.api.nexon.com/maplestory/v1/ranking/guild"
            ,
            "RankingDojang": "https://open.api.nexon.com/maplestory/v1/ranking/dojang",
            "RankingTheSeed": "https://open.api.nexon.com/maplestory/v1/ranking/theseed",
            "RankingAchievement": "https://open.api.nexon.com/maplestory/v1/ranking/achievement",
            "charcaterItem": "https://open.api.nexon.com/maplestory/v1/character/item-equipment"
        };
        const url = urlList[kind2];
        const apikey = yield config.getApiKey();
        const options = {
            uri: url,
            headers: {
                'x-nxopen-api-key': apikey,
            },
            qs: qs
        };
        let ret = yield rp(options).then().catch(
        //console.log("callAPI 에러 : " + ocid + " " + date + " " + kind2)
        );
        //return JSON.parse(ret).ocid;
        return ret;
    });
}
exports.callAPI = callAPI;
