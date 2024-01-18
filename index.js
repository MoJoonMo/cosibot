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
const openai_1 = __importDefault(require("openai"));
const chuop_1 = require("./function/simulator/chuop");
const core_1 = require("@remote-kakao/core");
// ChatGPT 시작
const openai = new openai_1.default();
function gpt_question(p_role, p_content) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(p_role);
        console.log(p_content);
        const completion = yield openai.chat.completions.create({
            messages: [{ role: p_role, content: p_content }],
            model: "gpt-3.5-turbo",
        });
        console.log(completion);
        return (completion.choices[0].message.content);
    });
}
//ChatGPT 끝
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
    else if (cmd === "gpt") {
        const p_role = "system";
        let p_content = "";
        if (args.length >= 1) {
            p_content = msg.content.split(prefix.concat(cmd))[1];
            const rep = yield gpt_question(p_role, p_content);
            console.log(msg);
            console.log(rep);
            msg.replyText(msg.sender.name + "님의 질문\nQ. " + p_content + "\n\n" + rep);
        }
        else {
            msg.replyText("질문이 없습니다.");
        }
    }
    else if (cmd === "추옵") {
        const a = yield (0, chuop_1.calcChuop)(msg.content);
        msg.replyText(a);
    }
    else if (cmd === "추옵시뮬") {
        const a = yield (0, chuop_1.calcChuopSimulator)(msg.content);
        msg.replyText(a);
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
