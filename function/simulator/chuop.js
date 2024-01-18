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
exports.calcChuopSimulator = exports.calcChuop = void 0;
//추옵 계산 시작
function calcChuop(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let m = msg.split(" ");
        let lvl = 160;
        let ret = "";
        if (m.length <= 2) { //변수가 안들어옴
            ret = "잘못된 명령어입니다.\n!추옵 레벨 환불종류\n ex) !추옵 160 강환불";
        }
        else {
            lvl = parseInt(m[1]);
            if (isNaN(lvl)) {
                ret = "잘못된 명령어입니다.\n!추옵 레벨 환불종류\n ex) !추옵 160 강환불";
            }
            else {
                let type = 1;
                let ret = lvl + "제 강환불";
                if (m[2] == "영환불") {
                    type = 2;
                    ret = lvl + "제 영환불";
                }
                ;
                let t = yield calcChuopDetail(type, lvl);
                //[str,dex,int,luk,all,att,mtt,mhp,mmp,spd,jmp,eqp]
                if (t[0] != 0) { //str
                    ret = ret + "\n" + "STR : +" + t[0];
                }
                if (t[1] != 0) { //dex
                    ret = ret + "\n" + "DEX : +" + t[1];
                }
                if (t[2] != 0) { //int
                    ret = ret + "\n" + "INT : +" + t[2];
                }
                if (t[3] != 0) { //luk
                    ret = ret + "\n" + "LUK : +" + t[3];
                }
                if (t[7] != 0) { //mhp
                    ret = ret + "\n" + "최대 HP : +" + t[7];
                }
                if (t[8] != 0) { //mmp
                    ret = ret + "\n" + "최대 MP : +" + t[8];
                }
                if (t[5] != 0) { //att
                    ret = ret + "\n" + "공격력 : +" + t[5];
                }
                if (t[6] != 0) { //mtt
                    ret = ret + "\n" + "마력 : +" + t[6];
                }
                if (t[9] != 0) { //spd
                    ret = ret + "\n" + "이동속도 : +" + t[9];
                }
                if (t[10] != 0) { //jmp
                    ret = ret + "\n" + "점프력 : +" + t[10];
                }
                if (t[4] != 0) { //all
                    ret = ret + "\n" + "올스탯 : +" + t[4] + "%";
                }
                if (t[12] != 0) { //def
                    ret = ret + "\n" + "방어력 : +" + t[12];
                }
                if (t[11] != 0) { //eqp
                    ret = ret + "\n" + "착용 제한 레벨 감소 : -" + t[11];
                }
                return ret;
            }
        }
        return ret;
    });
}
exports.calcChuop = calcChuop;
function calcChuopSimulator(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let m = msg.split(" ");
        let attp = 3.0;
        let allp = 10.0;
        let lvl = 160;
        let ret = "";
        let lim = 0;
        if (m.length <= 4) { //변수가 안들어옴
            ret = "잘못된 명령어입니다.\n명령어: !추옵시뮬 160 강환불 힘 120 10 3\n의미:160제 강환불 힘 120급이상 올스탯 1% = 주스탯 10 / 공격력 1 = 주스탯 3";
        }
        else {
            lvl = parseInt(m[1]);
            lim = parseInt(m[4]);
            if (m.length >= 6) {
                allp = parseFloat(m[5]);
            }
            if (m.length >= 7) {
                attp = parseFloat(m[6]);
            }
            if (isNaN(lvl) || isNaN(allp) || isNaN(attp) || isNaN(lim)) {
                ret = "잘못된 명령어입니다.\n명령어: !추옵시뮬 160 강환불 힘 120 10 3\n의미:160제 강환불 힘 120급이상 올스탯 1% = 주스탯 10 / 공격력 1 = 주스탯 3";
            }
            else {
                let type = 1;
                let ret = lvl + "제 강환불 " + m[3] + " " + lim + "급 이상";
                console.log(ret + " " + m[3] + " " + lim + "급이상 올스탯효율 : " + allp + " 공격력효율 : " + attp);
                if (m[2] == "영환불") {
                    type = 2;
                    ret = lvl + "제 영환불 " + m[3] + " " + lim + "급 이상";
                }
                ;
                let t;
                let i = 0;
                while (i < 500000) {
                    t = yield calcChuopDetail(type, lvl);
                    let sum = 0;
                    if (m[3] == "힘" || m[3] == "STR" || m[3] == "str") {
                        sum = t[0] + t[1] * 0.1 + t[4] * allp + t[5] * attp;
                    }
                    else if (m[3] == "덱" || m[3] == "덱스" || m[3] == "민첩" || m[3] == "DEX" || m[3] == "dex") {
                        sum = t[1] + t[0] * 0.1 + t[4] * allp + t[5] * attp;
                    }
                    else if (m[3] == "인" || m[3] == "인트" || m[3] == "지능" || m[3] == "INT" || m[3] == "int") {
                        sum = t[2] + t[3] * 0.1 + t[4] * allp + t[6] * attp;
                    }
                    else if (m[3] == "럭" || m[3] == "운" || m[3] == "행운" || m[3] == "LUK" || m[3] == "luk") {
                        sum = t[3] + t[1] * 0.1 + t[4] * allp + t[5] * attp;
                    }
                    i++;
                    if (sum >= lim) {
                        ret = ret + "\n" + i + "번을 돌려 " + sum + "급이 나왔습니다.";
                        if (t[0] != 0) { //str
                            ret = ret + "\n" + "STR : +" + t[0];
                        }
                        if (t[1] != 0) { //dex
                            ret = ret + "\n" + "DEX : +" + t[1];
                        }
                        if (t[2] != 0) { //int
                            ret = ret + "\n" + "INT : +" + t[2];
                        }
                        if (t[3] != 0) { //luk
                            ret = ret + "\n" + "LUK : +" + t[3];
                        }
                        if (t[7] != 0) { //mhp
                            ret = ret + "\n" + "최대 HP : +" + t[7];
                        }
                        if (t[8] != 0) { //mmp
                            ret = ret + "\n" + "최대 MP : +" + t[8];
                        }
                        if (t[5] != 0) { //att
                            ret = ret + "\n" + "공격력 : +" + t[5];
                        }
                        if (t[6] != 0) { //mtt
                            ret = ret + "\n" + "마력 : +" + t[6];
                        }
                        if (t[9] != 0) { //spd
                            ret = ret + "\n" + "이동속도 : +" + t[9];
                        }
                        if (t[10] != 0) { //jmp
                            ret = ret + "\n" + "점프력 : +" + t[10];
                        }
                        if (t[4] != 0) { //all
                            ret = ret + "\n" + "올스탯 : +" + t[4] + "%";
                        }
                        if (t[12] != 0) { //def
                            ret = ret + "\n" + "방어력 : +" + t[12];
                        }
                        if (t[11] != 0) { //eqp
                            ret = ret + "\n" + "착용 제한 레벨 감소 : -" + t[11];
                        }
                        break;
                    }
                }
                if (i == 500000)
                    ret = "50만번을 돌렸으나 결과가 나오지 않았습니다.";
                return ret;
                //[str,dex,int,luk,all,att,mtt,mhp,mmp,spd,jmp,eqp]
            }
        }
        return ret;
    });
}
exports.calcChuopSimulator = calcChuopSimulator;
function calcChuopProbability(type) {
    return __awaiter(this, void 0, void 0, function* () {
        let tmp = Math.floor(Math.random() * 1000);
        let p = []; // 누적 확률 세팅
        if (type == 1) { // 강환불
            p = [200, 500, 860, 1000, 1000];
        }
        else if (type == 2) { // 영환불
            p = [0, 290, 740, 990, 1000];
        }
        if (0 <= tmp && tmp < p[0]) {
            return 3; // 5추
        }
        else if (p[0] <= tmp && tmp < p[1]) {
            return 4; // 4추
        }
        else if (p[1] <= tmp && tmp < p[2]) {
            return 5; // 3추
        }
        else if (p[2] <= tmp && tmp < p[3]) {
            return 6; // 2추
        }
        else if (p[3] <= tmp && tmp < p[4]) {
            return 7; // 1추
        }
        else {
            return 0; // 오류
        }
    });
}
function calcRandomNumber(n) {
    return __awaiter(this, void 0, void 0, function* () {
        let num = [];
        // 0부터 18사이 뽑기 
        for (let i = 0; i < n; i++) {
            let tmp = Math.floor(Math.random() * 19);
            let issame = "Y";
            for (let j = 0; j < i; j++) {
                if (num[j] == tmp) {
                    issame = "N";
                    break;
                }
            }
            if (issame == "Y") {
                num.push(tmp);
            }
            else {
                i--;
            }
        }
        return num;
    });
}
function calcChuopDetail(type, lvl) {
    return __awaiter(this, void 0, void 0, function* () {
        let num = yield calcRandomNumber(4); // 랜덤 숫자 4개 뽑기
        let oneStat = Math.floor(lvl / 20) + 1; // 단일 추옵
        let twoStat = Math.floor(lvl / 40) + 1; // 이중 추옵
        let hpmp = Math.floor(Math.floor(lvl / 10) * 10) * 3;
        if (lvl == 250) {
            oneStat = 12;
            hpmp = 700;
        } // 에테르넬은 강제 보정
        // 공/마,올스탯은 1~7
        let str = 0;
        let dex = 0;
        let int = 0;
        let luk = 0;
        let att = 0;
        let mtt = 0;
        let all = 0;
        let mhp = 0;
        let mmp = 0;
        let spd = 0;
        let jmp = 0;
        let def = 0;
        let eqp = 0;
        for (let i = 0; i < 4; i++) {
            let t = Math.floor(num[i]);
            switch (t) {
                case 0:
                    str += (yield calcChuopProbability(type)) * oneStat;
                    break;
                case 1:
                    dex += (yield calcChuopProbability(type)) * oneStat;
                    break;
                case 2:
                    int += (yield calcChuopProbability(type)) * oneStat;
                    break;
                case 3:
                    luk += (yield calcChuopProbability(type)) * oneStat;
                    break;
                case 4:
                    str += (yield calcChuopProbability(type)) * twoStat;
                    dex += (yield calcChuopProbability(type)) * twoStat;
                    break;
                case 5:
                    str += (yield calcChuopProbability(type)) * twoStat;
                    int += (yield calcChuopProbability(type)) * twoStat;
                    break;
                case 6:
                    str += (yield calcChuopProbability(type)) * twoStat;
                    luk += (yield calcChuopProbability(type)) * twoStat;
                    break;
                case 7:
                    dex += (yield calcChuopProbability(type)) * twoStat;
                    int += (yield calcChuopProbability(type)) * twoStat;
                    break;
                case 8:
                    dex += (yield calcChuopProbability(type)) * twoStat;
                    luk += (yield calcChuopProbability(type)) * twoStat;
                    break;
                case 9:
                    int += (yield calcChuopProbability(type)) * twoStat;
                    luk += (yield calcChuopProbability(type)) * twoStat;
                    break;
                case 10: // 최대 HP
                    mhp += (yield calcChuopProbability(type)) * hpmp;
                    break;
                case 11: // 최대 MP
                    mmp += (yield calcChuopProbability(type)) * hpmp;
                    break;
                case 12: // 올스탯
                    all += yield calcChuopProbability(type);
                    break;
                case 13: // 공격력
                    att += yield calcChuopProbability(type);
                    break;
                case 14: // 마력
                    mtt += yield calcChuopProbability(type);
                    break;
                case 15: // 이동속도
                    spd += yield calcChuopProbability(type);
                    break;
                case 16: // 점프력
                    jmp += yield calcChuopProbability(type);
                    break;
                case 17: // 방어력
                    def += (yield calcChuopProbability(type)) * oneStat;
                    break;
                case 18: // 착감
                    eqp += (yield calcChuopProbability(type)) * 5;
                    break;
            }
        }
        let ret = [str, dex, int, luk, all, att, mtt, mhp, mmp, spd, jmp, eqp, def];
        return ret;
    });
}
/*
총 19개 || 쓸모 없는거 방어구 10개 / 무기 8개
0 : 단일 주스탯
1,2 : 이중 주스탯
3 : 단일 부스탯
4,5 : 이중 부스탯
6 : 이중 주스탯 + 부스탯
7 : 공격력
8 : 올스탯

단일 주스탯 1
이중 주스탯 2
단일 부스탯 1
이중 부스탯 2
이중 주스탯 + 부스탯 1
공격력 1
올스탯 1
// 무기만 //
보공 1
뎀 1
*/
//추옵 계산 끝
