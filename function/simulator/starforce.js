"use strict";
//렙제 from스타포스 to스타포스 이벤트
//m[0] m[1] m[2] m[3]
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
exports.makePrice = exports.calcStarforce = void 0;
function makePrice(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        //string을 오른쪽부터 3글자씩 콤마로 자르기
        let price = msg;
        let result = "";
        let len = price.length;
        let count = 0;
        for (let i = len - 1; i >= 0; i--) {
            if (count == 3) {
                result = "," + result;
                count = 0;
            }
            result = price[i] + result;
            count++;
        }
        return result;
    });
}
exports.makePrice = makePrice;
function calcStarforce(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let m = msg.split(" ");
        let level = parseInt(m[0]);
        let from = parseInt(m[1]);
        let to = parseInt(m[2]);
        let event = m[3];
        let starCatch = m[4];
        let mvpDiscount = m[5];
        let tv = yield starforceExpectedValue(level + " " + event + " " + starCatch + " " + mvpDiscount); // 레벨, 이벤트, 스타캐치, MVP 할인
        return yield makePrice("" + (tv[to] - tv[from]));
    });
}
exports.calcStarforce = calcStarforce;
function starforceExpectedValue(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let m = msg.split(" ");
        let level = parseInt(m[0]);
        let event = m[1];
        let starCatch = m[2];
        let mvpDiscount = m[3];
        let discountRate = 1; // 30% 할인 여부
        let ev = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 0~25성 강화시 예상비용
        let sp = [1, 0.95, 0.9, 0.85, 0.85, 0.8, 0.75, 0.70, 0.65, 0.6, 0.55, 0.50, 0.45, 0.4, 0.35, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.03, 0.02, 0.01]; //successProbability
        let dp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.021, 0.021, 0.021, 0.028, 0.028, 0.07, 0.07, 0.396, 0.294, 0.194]; //destroyProbability
        let downp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //downProbability
        let remainp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //remainProbability
        let c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //cost
        let tv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //totalValue
        if (starCatch == "true") {
            for (let i = 1; i <= 25; i++) {
                sp[i] = sp[i] * 1.05;
            }
        }
        if (event == "shiningStarforce" || event == "thiryPercent") {
            discountRate = 0.7;
        }
        if (event == "shiningStarforce" || event == "fiveTenFifteen") {
            sp[6] = 1;
            sp[11] = 1;
            sp[16] = 1;
        }
        if (event == "onePlusOne") {
            for (let i = 2; i <= 12; i = i + 2) {
                sp[i] = 1;
            }
        }
        for (let i = 16; i <= 18; i++) {
            dp[i] = (1 - sp[i]) * 0.03;
        }
        for (let i = 19; i <= 20; i++) {
            dp[i] = (1 - sp[i]) * 0.04;
        }
        for (let i = 21; i <= 22; i++) {
            dp[i] = (1 - sp[i]) * 0.1;
        }
        dp[23] = (1 - sp[23]) * 0.2;
        dp[24] = (1 - sp[24]) * 0.3;
        dp[25] = (1 - sp[25]) * 0.4;
        for (let i = 0; i <= 25; i++) {
            /* 스타포스 비용 구하기 */
            c[i] = (yield starforceCost(level + " " + i + m[1] + " preventDestroy")) * discountRate; // 30% 할인 여부
            if (mvpDiscount == "true" && i <= 17) {
                c[i] = c[i] * 0.9;
            }
            if ((i >= 17 && i <= 20) || (i >= 22)) {
                downp[i] = 1 - sp[i] - dp[i];
            }
            else {
                remainp[i] = 1 - sp[i] - dp[i];
            }
        }
        if (event == "onePlusOne") {
            for (let i = 2; i <= 12; i = i + 2) {
                c[i] = 0;
            }
        }
        for (let starforce = 1; starforce <= 25; starforce++) {
            let expectedValueBefore = ev[starforce - 1];
            let totalValueBefore = tv[starforce - 1];
            let totalValue12 = tv[12];
            let cost = c[starforce];
            let successProbability = sp[starforce];
            let destroyProbability = dp[starforce];
            let downProbability = downp[starforce];
            //        let remainProbability = remainp[starforce];
            let costBefore = c[starforce - 1];
            //        let successProbabilityBefore = sp[starforce-1];
            let destroyProbabilityBefore = dp[starforce - 1];
            let downProbabilityBefore = downp[starforce - 1];
            let remainProbabilityBefore = remainp[starforce - 1];
            let costBefore2 = 0;
            if (starforce == 1) {
                costBefore2 = 0;
            }
            else {
                costBefore2 = c[starforce - 2];
            }
            ev[starforce] = Math.round((cost +
                downProbability * costBefore +
                downProbability * remainProbabilityBefore * expectedValueBefore +
                downProbability * downProbabilityBefore * (costBefore2 + expectedValueBefore) +
                (destroyProbability + downProbability * destroyProbabilityBefore) * (0 - totalValue12 + totalValueBefore)) / successProbability);
            tv[starforce] = ev[starforce] + tv[starforce - 1];
        }
        return tv;
    });
}
// level, starforce, event, preventDestroy
function starforceCost(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let m = msg.split(" ");
        //m[0] = level, m[1] = Starforce Level
        let level = parseInt(m[0]);
        let starforce = parseInt(m[1]);
        let event = m[2];
        let preventDestroy = m[3];
        if (starforce == 0) { // 0성 강화비용
            return 0;
        }
        else { // 1성 이상 강화비용
            starforce = starforce - 1;
        }
        let cost = 0;
        let base = Math.pow(level, 3) * Math.pow(starforce + 1, 2.7);
        if (starforce >= 15) {
            cost = 1000 + base / 200;
        }
        else if (starforce >= 14) {
            cost = 1000 + base / 75;
        }
        else if (starforce >= 13) {
            cost = 1000 + base / 110;
        }
        else if (starforce >= 12) {
            cost = 1000 + base / 150;
        }
        else if (starforce >= 11) {
            cost = 1000 + base / 220;
        }
        else if (starforce >= 10) {
            cost = 1000 + base / 400;
        }
        else {
            cost = 1000 + Math.pow(level, 3) * (starforce + 1) / 25;
        }
        return Math.round(cost / 100) * 100;
    });
}
function starforceSuccessProbability(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let m = msg.split(" ");
        //m[0] = Starforcelevel
        let starforce = parseInt(m[0]);
        let probability = 0;
        if (starforce == 25) {
            probability = 0.01;
        }
        else if (starforce >= 24) {
            probability = 0.02;
        }
        else if (starforce >= 23) {
            probability = 0.03;
        }
        else if (starforce >= 16) {
            probability = 0.3;
        }
        else if (starforce >= 4) {
            probability = 1 - 5 * (starforce) / 100;
        }
        else if (starforce == 0 || starforce == -1) {
            probability = 1;
        }
        else {
            probability = 0.95 - 5 * (starforce) / 100;
        }
        return probability;
    });
}
function starforceDestroyProbability(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let m = msg.split(" ");
        //m[0] = Starforcelevel
        let starforce = parseInt(m[0]);
        let probability = 0;
        if (starforce == 25) {
            probability = 0.396;
        }
        else if (starforce >= 24) {
            probability = 0.294;
        }
        else if (starforce >= 23) {
            probability = 0.194;
        }
        else if (starforce >= 21) {
            probability = 0.07;
        }
        else if (starforce >= 19) {
            probability = 0.028;
        }
        else if (starforce >= 16) {
            probability = 0.021;
        }
        else {
            probability = 0;
        }
        return probability;
    });
}
