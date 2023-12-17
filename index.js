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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const core_1 = require("@remote-kakao/core");
const app = (0, express_1.default)();
const port = 5000;
// remote kakao 설정 시작
const prefix = ">";
const server = new core_1.UDPServer({ serviceName: "Example Service" });
server.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!msg.content.startsWith(prefix))
        return;
    const args = msg.content.split(" ");
    const cmd = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.slice(prefix.length);
    if (cmd === "ping") {
        /*
          this command's result is the ping between Node.js and MessengerBot,
          not between MessengerBot and the KakaoTalk server.
        */
        const timestamp = Date.now();
        yield msg.replyText("Pong!");
        msg.replyText(`${Date.now() - timestamp}ms`);
    }
}));
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
