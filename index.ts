import OpenAI from "openai";
import { calcChuop, calcChuopSimulator } from "./function/simulator/chuop";
import { findOCID, callAPI, question } from "./function/common/nexonAPI";
import { expHistory,current6thSkill, totalRanking, totalItemPrice, viewStarforceExpectecValue } from "./function/main/history";

import { UDPServer } from "@remote-kakao/core";

const request = require('request');

// ChatGPT 시작
const openai = new OpenAI();

async function gpt_question(p_role : any, p_content : any) {
  console.log(p_role);
  console.log(p_content);
  const completion = await openai.chat.completions.create({
    messages: [{ role: p_role, content: p_content }],
    model: "gpt-3.5-turbo",
  });
  console.log(completion);
  return( completion.choices[0].message.content);
}
//ChatGPT 끝



// remote kakao 설정 시작
const prefix : string = ">";
const server = new UDPServer({ serviceName: "Example Service" });


server.on("message", async (msg) => {
    if (!msg.content.startsWith(prefix)) return;
  
    const args = msg.content.split(" ");
    const cmd  = args.shift()?.slice(prefix.length);
  
    if (cmd === "ping") {
      /*
        this command's result is the ping between Node.js and MessengerBot,
        not between MessengerBot and the KakaoTalk server.
      */
      const timestamp = Date.now();
      await msg.replyText("Pong!");
      msg.replyText(`${Date.now() - timestamp}ms`);
    } /*else if (cmd === "gpt"){
      const p_role = "system";
      let p_content= "";
      
      if (args.length >=1){
        p_content = msg.content.split(prefix.concat(cmd))[1];
        const rep: any = await gpt_question(p_role,p_content);

        console.log(msg);
        console.log(rep);
        
        msg.replyText(msg.sender.name + "님의 질문\nQ. " + p_content + "\n\n"+  rep);
      }else {
        msg.replyText("질문이 없습니다.");
      }
    }*/else if(cmd === "추옵"){
      const a = await calcChuop(msg.content);
      msg.replyText(a);
    }else if(cmd === "추옵시뮬"){
      const a = await calcChuopSimulator(msg.content);
      msg.replyText(a);
    }else if(cmd === "ocid"){
      const a = await findOCID(msg.content);
      console.log('ocid : ' + a);
      msg.replyText('ocid : ' + a);
    }else if(cmd === "경험치히스토리" || cmd === "ㄱㅎㅊㅎㅅㅌㄹ"){
      const a = await expHistory(msg.content);
      console.log(a);
      msg.replyText(a);
    }else if(cmd === "" || cmd === ""){
      
    }else if(cmd === "6차" || cmd === "6ㅊ"){
      const a = await current6thSkill(msg.content);
      console.log(a);
      msg.replyText(a);
    }else if(cmd === "랭킹" || cmd === "ㄹㅋ"){
      const a = await totalRanking(msg.content);
      console.log(a);
      msg.replyText(a);
    }else if(cmd ==="스타포스" || cmd === "ㅅㅌㅍㅅ"){
      const a = await viewStarforceExpectecValue(msg.content);
      console.log(a);
      msg.replyText(a);
    }else if(cmd ==="기댓값" || cmd === "ㄱㄷㄱ" || cmd === "기대값"){
      const a = await totalItemPrice(msg.content);
      console.log(a);
      msg.replyText(a);
    }else if(cmd === "도움말" || cmd === "명령어"){
      msg.replyText(prefix+"6차 닉네임"
                  +"\n"+prefix+"경험치히스토리 닉네임"
                  +"\n"+prefix+"스타포스 레벨 시작별 끝별"
                  +"\n"+prefix+"추옵시뮬 160 강환불 힘 120 10 3"
                  +"\n"+"* 의미:160제 강환불 힘 120급이상 올스탯 1% = 주스탯 10 / 공격력 1 = 주스탯 3");
    }



    else if(cmd === "환산안해안돼234234234234234234234"){
      try {
        let p_content = msg.content.split(prefix.concat(cmd))[1].split(" ")[1];
        let p_date = '2024-01-18';
        const user_options = {
          // uri: "https://www.naver.com/",
          uri: "https://api.maplescouter.com/api/id",
          headers: {
            'Api-Key':'4d330fe2-36cb-41f9-82ee-b6d13c4800f6',
            'Accept':'application/json, text/plain, */*',

          },
          qs:{
            name: p_content,
            date: p_date
          }
        };
        let userStat : any;
        request(user_options,function(err : any,response : any, body : any){
          if(err) {console.log(err); msg.replyText("환산 에러1");}
          else{
            userStat = JSON.parse(body).userStat;
          }



          userStat = '{"userStat":' + JSON.stringify(userStat) +'}';
          userStat = JSON.parse(userStat);
          
          const dmg_options = {
            method: "POST",
            url: 'https://api.maplescouter.com/api/calc/dmg',
            headers: {
              'Api-Key':'4d330fe2-36cb-41f9-82ee-b6d13c4800f6',
              'Accept':'application/json, text/plain, */*',
            },
            body: userStat,
            json: true
          };

          let master_stat : any;
          let master_hexastat : any;
          let boss300_stat : any;
          let boss300_hexastat : any;
          let boss380_stat : any;
          let boss380_hexastat : any;

          request(dmg_options, function (err2 : any, res2 : any, body2 : any) {
            if(err2) {console.log(err2); msg.replyText("환산 에러2");}
            else{
              master_stat = body2.mr_stat;
              master_hexastat = body2.mr_hexaStat;
              boss300_stat = body2.boss300_stat;
              boss300_hexastat = body2.boss300_hexaStat;
              boss380_stat = body2.boss380_stat;
              boss380_hexastat = body2.boss380_hexaStat;
              msg.replyText(p_content +'님의 ' + p_date + '\n'
                          +'환산 : ' + master_stat + '\n'
                          +'헥사환산 : ' + master_hexastat + '\n'
                          +'보스 300 환산 : ' + boss300_stat + '\n'
                          +'보스 300 헥사환산 : ' + boss300_hexastat + '\n'
                          +'보스 380 환산 : ' + boss380_stat + '\n'
                          +'보스 380 헥사환산 : ' + boss380_hexastat 
              );

            }
          });

        
        });
      }catch(e){
        console.error(e);
      }
        
      

    }
    
});
  
server.start();


// remote kakao 설정 끝

/*
app.get('/', (req: Request, res: Response) => {
  res.send('Typescript + Node.js + Express Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at <https://localhost>:${port}`);
});
*/