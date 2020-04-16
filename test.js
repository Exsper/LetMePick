"use strict";

const Roller = require("./Roller");

// 模拟meta
console.log("你的QQ号是1了");
class Meta {
    constructor(qqId, ask) {
        this.userId = qqId; // 发送者id
        this.selfId = 114514; // 机器人id
        this.message = ask;
    }
    $send(s) {
        console.log("向" + this.userId + "发送消息：" + s);
    }
    $ban(t) {
        console.log(this.userId + "已被禁言 " + t + " 秒");
    }
}


// 模拟next
// eslint-disable-next-line require-jsdoc
function next() {
    console.log("不处理，转向下一个插件");
}


let rollCollector = {};


let myQQ = 1;
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on("line", (line) => {
    if (line === "qq2") {
        myQQ = 2;
        console.log("你的QQ号是2了");
    }
    else if (line === "qq1") {
        myQQ = 1;
        console.log("你的QQ号是1了");
    }
    else if (line === "qq3") {
        myQQ = 3;
        console.log("你的QQ号是3了");
    }
    else run(new Meta(myQQ, line), next);
});



async function run(meta, next) {
    try {
        const qqId = meta.userId;
        let msg = meta.message;
        if (msg.length < 8) return next();
        const msgPrefix = msg.substring(0, 1);
        if ((msgPrefix !== "!") && (msgPrefix !== "！")) return next();
        msg = msg.substring(1).trim();
        if (msg.indexOf("roll.next") >= 0) {
            if (!rollCollector[qqId]) return meta.$send(`[CQ:at,qq=${meta.userId}]` + "请先使用!roll.new创建一个图池");
            return meta.$send(`[CQ:at,qq=${meta.userId}]` + rollCollector[qqId].roll());
        }
        if (msg.indexOf("roll.new") >= 0) {
            let argString = msg.substring(msg.indexOf("roll.new") + 8).trim();
            if (argString.length < 1) return meta.$send(`[CQ:at,qq=${meta.userId}]` + "请指明图池中各mod数量（不含TB），例如：!roll.new NM3 HD2 HR2 DT3");
            let arg = argString.match(/[a-zA-Z]+[0-9]+/ig);
            if (!arg) return meta.$send(`[CQ:at,qq=${meta.userId}]` + "请指明图池中各mod数量（不含TB），例如：!roll.new NM3 HD2 HR2 DT3");
            let mods = [];
            let amount = [];
            arg.map((value) => {
                mods.push(value.replace(/[0-9]/ig, ""));
                amount.push(parseInt(value.replace(/[^0-9]/ig, "")));
            });
            rollCollector[qqId] = new Roller(mods, amount);
            return meta.$send("创建成功！\n" + `[CQ:at,qq=${meta.userId}]` + rollCollector[qqId].info() + "\n输入!roll.next开始roll图");
        }
        if (msg.indexOf("roll.delete") >= 0) {
            delete rollCollector[qqId];
            return meta.$send(`[CQ:at,qq=${meta.userId}]` + "已删除您的roll点图池");
        }
        return next();
    } catch (ex) {
        console.log(ex);
        return next();
    }

}


