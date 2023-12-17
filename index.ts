import express, { Express, Request, Response } from 'express';
import { UDPServer } from "@remote-kakao/core";

const app: Express = express();
const port = 5000;

// remote kakao 설정 시작
const prefix = ">";
const server = new UDPServer({ serviceName: "Example Service" });


server.on("message", async (msg) => {
    if (!msg.content.startsWith(prefix)) return;
  
    const args = msg.content.split(" ");
    const cmd = args.shift()?.slice(prefix.length);
  
    if (cmd === "ping") {
      /*
        this command's result is the ping between Node.js and MessengerBot,
        not between MessengerBot and the KakaoTalk server.
      */
      const timestamp = Date.now();
      await msg.replyText("Pong!");
      msg.replyText(`${Date.now() - timestamp}ms`);
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