import { findOCID, question } from "../common/nexonAPI";
import {calcStarforce, makePrice}  from "../simulator/starforce";
async function getDateString(i:number){
    let d = new Date();
    
    d.setDate(d.getDate()-i); 
    d.setHours(d.getHours()-1); 
    d.setMinutes(d.getMinutes()-10);// 매일 오전 1시 이후 API가 Update 됨 안전하게 1시 10분부터 전날거 검색 되게 수정

    let year = d.getFullYear();
    let month_temp =d.getMonth()+1;
    let month = "" + month_temp;
    if (month_temp < 10) month = "0" + month;
    let date_temp = d.getDate();
    let date = "" + date_temp;
    if (date_temp < 10) date = "0" + date;
    let curDate = year+"-"+month+"-"+date;
    
    console.log(curDate);
    return curDate;
}

async function expHistory(msg:string) {
    let m = msg.split(" "); // !경험치히스토리 닉네임
    console.log("경험치히스토리 요청\n" + msg);

    let req = '★' + m[1] + '★ 경험치히스토리';
    for(let i = 7 ; i >=1 ; i--){
        const curDate = await getDateString(i);
        const rq = m[1] + " " + curDate + " " +'basicUser'; //닉네임, 날짜, 요청명
        try {
            const a = await question(rq);
            const response = JSON.parse(a);

            req = req +"\n"+ curDate + ": Lv."+response.character_level + " (" + response.character_exp_rate + "%)";
        }catch (e) {
            console.log("expHistory JSON 에러 : "+ rq);
        }        
    }
    return req;
}

async function current6thSkill(msg:string){
    let m = msg.split(" ");
    console.log("6차스킬 요청\n" + msg);
    let req = '★' + m[1] + '★ ';
    const total_sol = 1011; // 1016(오리진은 지급해서 -5) = 1011 // 자유전직 하면 아니라고함
    const total_sol_piece = 28704; // 28804(오리진은 지급해서 -100) = 28704 // 자유전직하면 아니라고함

    try{
        const curDate = await getDateString(1);
        const rq = m[1] + " " + curDate + " " +'UserSkill6'; //닉네임, 날짜, 요청명
        req = req + curDate;
        const a = await question(rq);
        const response = JSON.parse(a);
        const skill_len = response.character_skill.length;
        const skill4 = ['레이징블로우VI',	'레이지업라이징VI', '블래스트VI',	'디바인차지VI', '궁니르디센트VI',	'다크임페일VI', '플레임스윕VI',	'플레임헤이즈VI', '체인라이트닝VI',	'프로즌오브VI', '엔젤레이VI',	'트라이엄프페더VI', '폭풍의시VI',	'애로우플래터VI', '스나이핑VI',	'피어싱VI', '카디널블래스트VI',	'카디널디스차지VI', '쿼드러플스로우VI',	'마크오브어쌔신VI', '암살VI',	'메소익스플로젼VI', '팬텀블로우VI',	'아수라VI', '피스트인레이지VI',	'씨서펜트VI', '래피드파이어VI',	'배틀쉽봄버VI', '캐논버스터VI',	'미니캐논볼VI', '샤이닝크로스VI',	'로얄가드VI', '솔라슬래시VI',	'코스믹샤워VI', '오비탈플레임VI',	'블레이징익스팅션VI', '천공의노래VI',	'트라이플링윔VI', '퀀터플스로우VI',	'쉐도우배트VI', '섬멸VI',	'벽력VI', '비욘더VI',	'부스트엔드-헌터즈타겟팅VI', '서클오브마나VI',	'서클오브썬더VI', '이슈타르의링VI',	'리프토네이도VI', '앱솔루트킬VI',	'라이트리플렉션VI', '귀참VI',	'소혼장막VI', '템페스트오브카드VI',	'얼티밋드라이브VI', '매그넘펀치VI',	'릴리즈파일벙커VI', '데스VI',	'피니쉬블로우VI', '와일드발칸VI',	'클로우컷VI', '매시브파이어:SPLASH-FVI',	'호밍미사일VI', '매시브파이어:퍼지롭매스커레이드VI',	'트라이앵글포메이션VI', '데몬임팩트VI',	'데몬슬래시VI', '실드체이싱VI',	'익시드:엑스큐션VI', '기가슬래셔VI',	'소드스트라이크VI', '폴링더스트VI',	'스트라이크애로우VI', '체인아츠:스트로크VI',	'웨폰버라이어티VI', '트리니티VI',	'소울시커VI', '기가크래시VI',	'터닝드라이브VI', '얼티메이트메테리얼VI',	'싸이킥그랩VI', '디바이드VI',	'오더VI', '크래프트:자벨린VI',	'리액션:도메니에션VI', '아츠:플러리VI',	'보이드러쉬VI', '플레인차지드라이브VI',	'지워지지않는상처VI', '정기뿌리기VI',	'용맥분출VI', '멸화염VI',	'파초풍:천VI' ];
        // 4차,5차,6차,공용코어 솔 에르다, 솔 에르다 조각 소모 개수
        const skill6_sol = [0, 0, 1, 2, 3, 5, 7, 9, 12, 15, 25, 28, 31, 35, 39, 43, 47, 51, 55, 60, 75, 80, 85, 90, 95, 100, 106, 112, 118, 125, 145];
        const skill6_sol_piece = [0, 0, 30, 65, 105, 150, 200, 255, 315, 380, 580, 660, 750, 850, 960, 1080, 1210, 1350, 1500, 1660, 2010, 2180, 2360, 2550, 2750, 2960, 3180, 3410, 3650, 3900, 4400];
        const skill4_sol = [0, 3, 4, 5, 6, 7, 8, 9, 11, 13, 18, 20, 22, 24, 26, 28, 30, 32, 34, 37, 45, 48, 51, 54, 57, 60, 63, 66, 69, 73, 83];
        const skill4_sol_piece =[0,  50, 65, 83, 103, 126, 151, 179, 209, 242, 342, 382, 427, 477, 532, 592, 657, 727, 802, 882, 1057, 1142, 1232, 1327, 1427, 1532, 1642, 1757, 1877, 2002, 2252];
        const skill5_sol =[0, 4, 5, 6, 7, 9, 11, 13, 16, 19, 27, 30, 33, 36, 39, 42, 45, 48, 51, 55, 67, 71, 75, 79, 83, 87, 92, 97, 102, 108, 123];
        const skill5_sol_piece =[0, 75, 98, 125, 155, 189, 227, 269, 314, 363, 513, 573, 641, 716, 799, 889, 987, 1092, 1205, 1325, 1588, 1716, 1851, 1994, 2144, 2302, 2467, 2640, 2820, 3008, 3383];
        const common_sol = [0, 7, 9, 11, 13, 16, 19, 22, 27, 32, 46, 51, 56, 62, 68, 74, 80, 86, 92, 99, 116, 123, 130, 137, 144, 151, 160, 169, 178, 188, 208];
        const common_sol_piece = [0, 125, 163, 207, 257, 314, 377, 446, 521, 603, 903, 1013, 1137, 1275, 1427, 1592, 1771, 1964, 2171, 2391, 2916, 3150, 3398, 3660, 3935, 4224, 4527, 4844, 5174, 5518, 6268];
        let sol = 0;
        let sol_piece = 0;
        
        for (let i = 0 ; i < skill_len ; i++){
            const skill_name = response.character_skill[i].skill_name.replace(" ","");
            if(skill_name.indexOf("VI") != -1){ // 4차
                for(let s4 of skill4){
                    if(skill_name.indexOf(s4) != -1){
                        let s = sol; let sp = sol_piece;
                        sol = sol + skill4_sol[parseInt(response.character_skill[i].skill_level)];
                        sol_piece = sol_piece + skill4_sol_piece[parseInt(response.character_skill[i].skill_level)];
                        console.log("4차 " + skill_name + " " + response.character_skill[i].skill_leve + " " + (sol-s) + " " + (sol_piece-sp));
                        break;
                    }
                }
            }else if(skill_name.indexOf("강화") != -1){ // 5차
                let s = sol; let sp = sol_piece;
                sol = sol + skill5_sol[parseInt(response.character_skill[i].skill_level)];
                sol_piece = sol_piece + skill5_sol_piece[parseInt(response.character_skill[i].skill_level)];
                console.log("5차 " + skill_name + " " + response.character_skill[i].skill_leve + " " + (sol-s) + " " + (sol_piece-sp));
            }else if(skill_name === "솔야누스"){ // 공용
                let s = sol; let sp = sol_piece;
                sol = sol + common_sol[parseInt(response.character_skill[i].skill_level)];
                sol_piece = sol_piece + common_sol_piece[parseInt(response.character_skill[i].skill_level)];
                console.log("공용 " + skill_name + " " + response.character_skill[i].skill_leve + " " + (sol-s) + " " + (sol_piece-sp));
            }
            else{ // 6차
                if(skill_name.indexOf("HEXA스탯") == -1 && skill_name.indexOf("솔야누스") == -1){
                    let s = sol; let sp = sol_piece;
                    sol = sol + skill6_sol[parseInt(response.character_skill[i].skill_level)];
                    sol_piece = sol_piece + skill6_sol_piece[parseInt(response.character_skill[i].skill_level)];
                    console.log("6차 " + skill_name + " " + response.character_skill[i].skill_leve + " " + (sol-s) + " " + (sol_piece-sp));
                }
            }
        }
        console.log("" + (sol/10.0/total_sol));
        req = req + "\n누적 사용 솔 에르다 : " + sol + "개\n" + (Math.round(sol*10000/total_sol)/100) + "% 진행 (" + sol + "/" + total_sol + ")\n누적 사용 조각 : "+ sol_piece + "개\n" +(Math.round(1.0*sol_piece*10000/total_sol_piece)/100) + "% 진행 ("+sol_piece+"/"+total_sol_piece+")";
    }catch (e) {
        console.log("6차 JSON 에러 : " + e);
    }

    return req;
}

async function totalRanking(msg:string){
    let m = msg.split(" ");
    console.log("랭킹\n" + msg);
    
   
    const curDate = await getDateString(1);
    let req = '★' + m[1] + '★ ' +curDate;
    const rq1 = m[1] + " " + curDate + " " +'RankingOverall'; //닉네임, 날짜, 요청명
    const rq2 = m[1] + " " + curDate + " " +'RankingUnion'; //닉네임, 날짜, 요청명
    const rq3 = m[1] + " " + curDate + " " +'RankingDojang'; //닉네임, 날짜, 요청명
    const rq4 = m[1] + " " + curDate + " " +'RankingTheSeed'; //닉네임, 날짜, 요청명
    const rq5 = m[1] + " " + curDate + " " +'RankingAchievement'; //닉네임, 날짜, 요청명
    
    try {
        const a = await question(rq1);
        const response = JSON.parse(a);
        req = req + "\n전체 랭킹 : " + response.ranking[0].ranking + "위 (Lv." + response.ranking[0].character_level+")";
    }catch (e) {
        console.log("expHistory JSON 에러 : "+ rq1);
    }  
    /*
    try {
        const a = await question(rq3);
        const response = JSON.parse(a);
        req = req + "무릉 랭킹 : " + response.ranking[0].ranking + "위("+response.ranking[0].dojang_floor+"층)";
    }catch (e) {
        console.log("expHistory JSON 에러 : "+ rq3);
    }  
    
    try {
        const a = await question(rq4);
        const response = JSON.parse(a);
        req = req + "시드 랭킹 : " + response.ranking[0].ranking + "위";
    }catch (e) {
        console.log("expHistory JSON 에러 : "+ rq4);
    }  
    */
    try {
        const a = await question(rq5);
        const response = JSON.parse(a);
        req = req + "\n업적 랭킹 : " + response.ranking[0].ranking + "위 ("+response.ranking[0].trophy_score + "점)";
    }catch (e) {
        console.log("expHistory JSON 에러 : "+ rq5);
    }  

    try {
        const a = await question(rq2);
        const response = JSON.parse(a);
        req = req + "\n유니온 랭킹 : " + response.ranking[0].ranking + "위 (Lv."+response.ranking[0].union_level+")";
    }catch (e) {
        console.log("expHistory JSON 에러 : "+ rq2);
    }  
    return req;
}
//level from to event
async function viewStarforceExpectecValue(msg:string){
    let m = msg.split(" ");
    let level = parseInt(m[1]);
    let from = parseInt(m[2]);
    let to = parseInt(m[3]);

    /* 스타캐치 O*/
    let shining = await calcStarforce(level + " " + from + " " + to + " shiningStarforce true true") + "원";
    let thiryPercent = await calcStarforce(level + " " + from + " " + to + " thiryPercent true true") + "원";
    let fiveTenFifteen = await calcStarforce(level + " " + from + " " + to + " fiveTenFifteen true true") + "원";
    let onePlusOne = await calcStarforce(level + " " + from + " " + to + " onePlusOne true true") + "원";
    let noEvent = await calcStarforce(level + " " + from + " " + to + " noEvent true true") + "원";
    
    let dp = [0.065, 0.272, 0.701, 1.516, 2.998, 3.867, 6.627, 108, 4895, 456264]; // 일반상황 16성부터 터지는 갯수
    let destoryFrom = 0;
    let destoryTo = 0;
    
    if (from >= 16){
        destoryFrom = dp[from-16];
    }
    if (to >= 16){
        destoryTo = dp[to-16];
    }

    let eventdp = [0.00000, 0.065, 0.272, 0.725, 1.595, 2.159, 3.950, 69.897, 3176, 296143]; // 샤타포스 16성부터 터지는 갯수
    let eventdestoryFrom = 0;
    let eventdestoryTo = 0;
    if (from >= 16){
        eventdestoryFrom = eventdp[from-16];
    }
    if (to >= 16){
        eventdestoryTo = eventdp[to-16];
    }

    let ret = level + "제 " + from + "성부터 " + to + "성까지 파괴방지X\n★예상 스타포스 비용★";
    ret = ret + "\n※ 스타캐치O, MVP할인O, PC방할인X\n1) 샤타포스 : " + shining  + "\n2) 5/10/15 100% : " + fiveTenFifteen ;
    ret = ret + "\n → 터진 횟수 : " + (eventdestoryTo - eventdestoryFrom) + "회";
    ret = ret + "\n3) 30% 할인 : " + thiryPercent+ "\n4) 1 + 1 : " + onePlusOne + "\n5) 이벤트 없음 : " + noEvent
    ret = ret + "\n → 터진 횟수 : " + (destoryTo - destoryFrom) + "회";

    /* 스타캐치 X */
    
    shining = await calcStarforce(level + " " + from + " " + to + " shiningStarforce false true") + "원";
    thiryPercent = await calcStarforce(level + " " + from + " " + to + " thiryPercent false true") + "원";
    fiveTenFifteen = await calcStarforce(level + " " + from + " " + to + " fiveTenFifteen false true") + "원";
    onePlusOne = await calcStarforce(level + " " + from + " " + to + " onePlusOne false true") + "원";
    noEvent = await calcStarforce(level + " " + from + " " + to + " noEvent false true") + "원";

    dp = [0.07, 0.303, 0.815, 1.848, 3.848, 4.979, 8.750, 151, 7178, 703192]; // 일반상황 16성부터 터지는 갯수
    destoryFrom = 0;
    destoryTo = 0;
    
    if (from >= 16){
        destoryFrom = dp[from-16];
    }
    if (to >= 16){
        destoryTo = dp[to-16];
    }

    eventdp = [0.00000, 0.07, 0.303, 0.841, 1.938, 2.624, 4.909, 91, 4350, 426168]; // 샤타포스 16성부터 터지는 갯수
    eventdestoryFrom = 0;
    eventdestoryTo = 0;
    if (from >= 16){
        eventdestoryFrom = eventdp[from-16];
    }
    if (to >= 16){
        eventdestoryTo = eventdp[to-16];
    }

    ret = ret + "\n\n※ 스타캐치X, MVP할인O, PC방할인X\n1) 샤타포스 : " + shining  + "\n2) 5/10/15 100% : " + fiveTenFifteen ;
    ret = ret + "\n → 터진 횟수 : " + (eventdestoryTo - eventdestoryFrom) + "회";
    ret = ret + "\n3) 30% 할인 : " + thiryPercent+ "\n4) 1 + 1 : " + onePlusOne + "\n5) 이벤트 없음 : " + noEvent
    ret = ret + "\n → 터진 횟수 : " + (destoryTo - destoryFrom) + "회";

    return ret;
}



async function calcChuopExpectedValue(msg:string) {
    let m = msg.split(" ");
    let lvl = parseInt(m[1]);
    let want = parseInt(m[2]);
    let o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let level20 = Math.floor(lvl / 20);
    let level40 = Math.floor(lvl / 40);

    if (lvl >= 240) {
      level20 -= 1;
    }

    let substatto = 0.1; // 부스탯
    let substat2to = 0; // 부스탯2
    let attto = 3; // 공격력
    let all1to = 10; // 올스탯
    o[0] = level20 + 1; // STR
    o[1] = (level20 + 1) * substatto; // DEX
    o[2] = (level40 + 1) * (substatto + 1.0); // STR+DEX
    o[3] = (level40 + 1); // STR+INT
    o[4] = (level40 + 1) + (level40 + 1) * substat2to; // STR+LUK
    o[5] = (level40 + 1) * substatto; // DEX+INT
    o[6] = (level40 + 1) * substatto + (level40 + 1) * substat2to; // DEX+LUK
    o[7] = attto; // 공격력 
    o[8] = all1to; // 올스탯
    o[9] = (level20 + 1) * substat2to; // LUK
    let optionName = ['주스탯', '부스탯1', '주스탯+부스탯1', '주스탯+잡스탯', '주스탯+부스탯2', '부스탯1+잡스탯', '부스탯1+부스탯2', '공격력', '올스탯%', '잡스탯', '잡옵', '잡옵', '잡옵', '잡옵', '잡옵', '잡옵', '잡옵', '잡옵', '잡옵']
    for (let i = 10; i < 19; i += 1) {
      o[i] = 0.0;
    }

    //let gangFlame: number = 0, youngFlame: number = 0, gangFlameResult = new Array<ChuopResult>(), youngFlameResult = new Array<ChuopResult>(), gangFlameBucket = new Array<CubeBucket>(), youngFlameBucket = new Array<CubeBucket>()
    //let gangFlamePrice: number = 0, youngFlamePrice: number = 0
    //let gangProbability: number = 0, youngProbability: number = 0
/*
    let gangFlameBucket =[];
    let youngFlameBucket =[];
    let gangFlameResult =[];
    let youngFlameResult =[];

    for (let iter = 0; iter < 300; iter += 1) {
      gangFlameBucket.push({ iter: iter, 확률: 0, o1: [[]] });
      youngFlameBucket.push({ iter: iter, 확률: 0, o1: [[]] });
    }
*/
    let p = [0, 0, 0, 0, 0, 0, 0, 0]
    let youngProbability = 0;
    let gangProbability = 0;
    for (let jjj = 0; jjj < 2; jjj += 1) {
        if (jjj === 0) {
            p[3] = 0.2;
            p[4] = 0.3;
            p[5] = 0.36;
            p[6] = 0.14;
            p[7] = 0.0;
        } else if (jjj === 1) {
            p[3] = 0.0;
            p[4] = 0.29;
            p[5] = 0.45;
            p[6] = 0.25;
            p[7] = 0.01;
        }
    
        let probability = 0


        for (let i = 0; i < 19; i += 1) {
            for (let j = i + 1; j < 19; j += 1) {
                if (i !== j) {
                    for (let k = j + 1; k < 19; k += 1) {
                        if (j !== k && i !== k) {
                            for (let l = k + 1; l < 19; l += 1) {
                                if (l !== i && l !== j && l !== k) {
                                    for (let a = 3; a <= 7; a += 1) {
                                        for (let b = 3; b <= 7; b += 1) {
                                            for (let c = 3; c <= 7; c += 1) {
                                                for (let d = 3; d <= 7; d += 1) {
                                                    if (want <= o[i] * a + o[j] * b + o[k] * c + o[l] * d) {
                                                        var temp_p = p[a] * p[b] * p[c] * p[d] / 3876;
                                                        probability += temp_p;

                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        if (jjj === 0) {
            gangProbability = probability;
        } else if (jjj === 1) {
            youngProbability = probability;
        }
    }

    return [gangProbability,youngProbability];
}

async function totalItemPrice(msg:string){
    let m = msg.split(" ");
    let tylent = [0,106347048,308912853,626433563,1108438798,1749256392,2574834625,3677314071,5207445411,7473742727,11689766611,20522990721,38793888619,867535584188,40244388991006,3772983870848390];

    console.log("장비 스타포스 총합 \n" + msg);

    const curDate = await getDateString(1);

    let req = '★' + m[1] + '★ '+ curDate;
    let total_price = 0;
    let req2 ="";
    //event가 shiningStarforce, thiryPercent, fiveTenFifteen, onePlusOne  
    
    const rq = m[1] + " " + curDate + " " +'charcaterItem'; //닉네임, 날짜, 요청명
    const rq2 = m[1] + " " + curDate + " " +'characterStat'; //닉네임, 날짜, 요청명
    try {
        const a = await question(rq);
        const user = await question(rq2); // 직업 갖고 오기용
        const user_response = JSON.parse(user);
        const cl =user_response.character_class;
        const stat = user_response.final_stat;
        let statKind = "STR";
        if ( cl === "제논" || cl === "데몬어벤져") {
            //제논, 데몬어벤져는 추옵 계산이 불가능
        }
        else{
            for(let i of stat){
                if(i.stat_name === "AP 배분 STR"){
                    if (i.stat_value > 100)
                        statKind = "STR";
                }else if(i.stat_name === "AP 배분 DEX"){
                    if (i.stat_value > 100)
                        statKind = "DEX";
                }else if(i.stat_name === "AP 배분 INT"){
                    if (i.stat_value > 100)
                        statKind = "INT";
                }else if(i.stat_name === "AP 배분 LUK"){
                    if (i.stat_value > 100)
                        statKind = "LUK";
                }
            }
        }
        
        /*

        히어로, 팔라딘, 다크나이트, 아크메이지(불,독), 아크메이지(썬,콜), 비숍, 보우마스터, 신궁, 패스파인더, 나이트로드,
섀도어, 듀얼블레이더, 캐논슈터, 바이퍼, 캡틴, 캐논마스터, 소울마스터, 플레임위자드, 윈드브레이커, 나이트워커,
스트라이커, 미하일, 아란, 에반, 배틀메이지, 와일드헌터, 메카닉, 데몬슬레이어, 데몬어벤져, 제논,
블래스터, 메르세데스, 팬텀, 루미너스, 카이저, 엔젤릭버스터, 제로, 은월, 키네시스, 카데나,
일리움, 아크, 호영, 아델, 카인, 라라, 칼리

*/

        const response = JSON.parse(a);
        const item = response.item_equipment;
        const dp = [0.00000, 0.065, 0.272, 0.725, 1.595, 2.159, 3.950, 69.897, 3176, 296143]; // 샤타포스 16성부터 터지는 갯수


        for(let i of item){
            let c = await calcStarforce(i.item_base_option.base_equipment_level + " 0 " + i.starforce + " shiningStarforce true true");
            //레벨에 추옵 몇급인지만 알면 됨
            

            if(i.item_name.indexOf("타일런트") != -1){
                c = await makePrice("" + tylent[i.starforce]);
            }
            if(i.item_name.indexOf("제네시스") != -1){
                c = "0";
            }
            let itemPrice = 0;
            if(i.item_name.indexOf("에테르넬") != -1){
                itemPrice = 2200000000;
            }
            //마력이 깃든 안대 22억
            if(i.item_name.indexOf("마력이 깃든 안대") != -1){
                itemPrice = 2200000000;
            }
            //루즈 컨트롤 머신 마크 15억
            if(i.item_name.indexOf("루즈 컨트롤 머신 마크") != -1){
                itemPrice = 1500000000;
            }
            //몽환의 벨트 28억
            if(i.item_name.indexOf("몽환의 벨트") != -1){
                itemPrice = 2800000000;
            }
            //거대한 공포 55억
            if(i.item_name.indexOf("거대한 공포") != -1){
                itemPrice = 5500000000;
            }
            //창세의 뱃지 250억
            if(i.item_name.indexOf("창세의 뱃지") != -1){
                itemPrice = 25000000000;
            }
            //데이브레이크 8억
            if(i.item_name.indexOf("데이브레이크") != -1){
                itemPrice = 800000000;
            }
            //커맨더 포스 이어링 22억
            if(i.item_name.indexOf("커맨더 포스 이어링") != -1){
                itemPrice = 2200000000;
            }
            //미트라의 분노 60억
            if(i.item_name.indexOf("미트라의 분노") != -1){
                itemPrice = 6000000000;
            }
            //마도서 47억
            if(i.item_name.indexOf("마도서") != -1){
                itemPrice = 4700000000;
            }
            //고통의 근원 36억
            if(i.item_name.indexOf("고통의 근원") != -1){
                itemPrice = 3600000000;
            }
            
            if(i.starforce >=17){
                itemPrice = itemPrice * dp[i.starforce-16];
            }
            let tc = parseInt(c.replace(/,/g,"")) + itemPrice;
            total_price = total_price + parseInt(c.replace(/,/g,"")) + itemPrice;
            c = await makePrice("" + tc) + "원";
            console.log("★ " + i.starforce + "성 " +i.item_base_option.base_equipment_level + "제 "+ i.item_equipment_part + " " + i.item_name + " " + i.starforce_scroll_flag + "\n" + c);
            
            if(i.starforce_scroll_flag === "미사용"){
                req2 = req2 +"\n★ "+ i.starforce + "성 " + i.item_base_option.base_equipment_level + "제 "+ i.item_equipment_part + " " + i.item_name + "\n → 샤타포스 비용 : " + c;
                
            }
            else
                req2 = req2 +"\n★ "+ i.starforce + "성 " + i.item_base_option.base_equipment_level + "제 "+ i.item_equipment_part + " 놀장 " + i.item_name + "\n";
        }   
        req = req + "\n- 총 스타포스 비용 : " + await makePrice("" + total_price) + "원";

        
    }catch (e) {
        console.log("totalItemPrice JSON 에러 : "+ rq);
    }        
    
    return req+req2;
}
/*
async function template(msg:string){
    let m = msg.split(" ");
    console.log("템플릿 \n" + msg);
    let req = '★' + m[1] + '★ ';
   
    const curDate = await getDateString(1);
    const rq = m[1] + " " + curDate + " " +'basicUser'; //닉네임, 날짜, 요청명
    try {
        const a = await question(rq);
        const response = JSON.parse(a);

        req = req +"\n"+ curDate + ": Lv."+response.character_level + " (" + response.character_exp_rate + "%)";
    }catch (e) {
        console.log("expHistory JSON 에러 : "+ rq);
    }        
    
    return req;
}
*/

export {expHistory, current6thSkill, totalRanking, viewStarforceExpectecValue, totalItemPrice};