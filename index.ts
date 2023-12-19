import OpenAI from "openai";

import { UDPServer } from "@remote-kakao/core";

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
const prefix : string = "!";
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
    } else if (cmd === "gpt"){
      const p_role = "system";
      let p_content= "";
      
      if (args.length >=1){
        p_content = msg.content.split(prefix.concat(cmd))[1];

        const rep: any = await gpt_question(p_role,p_content);
        console.log(msg);

        console.log(rep);
        
        msg.replyText(msg.sender.name + "님의 질문\nQ. " + p_content + "\n\n"+  rep);
      }
      else {
        msg.replyText("질문이 없습니다.");
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