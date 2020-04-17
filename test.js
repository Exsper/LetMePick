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
        if (msg.length < 4) return next();
        const msgPrefix = msg.substring(0, 1);
        if ((msgPrefix !== "!") && (msgPrefix !== "！")) return next();
        msg = msg.substring(1).trim();
        if (msg.indexOf("rhelp") >= 0) {
            return meta.$send(`[CQ:at,qq=${meta.userId}]\n` + "比赛随机选图\n!rnew 新建图池\n!rnext roll出下一个赛图\n!rlog 显示已选赛图\n!rdelete 删除当前图池");
        }
        if (msg.indexOf("rnext") >= 0) {
            if (!rollCollector[qqId]) return meta.$send(`[CQ:at,qq=${meta.userId}]` + "\n请先使用!rnew创建一个图池");
            return meta.$send(`[CQ:at,qq=${meta.userId}]\n` + rollCollector[qqId].roll());
        }
        if (msg.indexOf("rlog") >= 0) {
            if (!rollCollector[qqId]) return meta.$send(`[CQ:at,qq=${meta.userId}]` + "\n请先使用!rnew创建一个图池");
            return meta.$send(`[CQ:at,qq=${meta.userId}]\n` + rollCollector[qqId].showRecord());
        }
        if (msg.indexOf("rnew") >= 0) {
            let argString = msg.substring(msg.indexOf("rnew") + 4).trim();
            if (argString.length < 1) return meta.$send(`[CQ:at,qq=${meta.userId}]` + "\n请指明图池中各mod数量（不含TB），例如：!rnew NM3 HD2 HR2 DT3");
            let arg = argString.match(/[a-zA-Z]+[0-9]+/ig);
            if (!arg) return meta.$send(`[CQ:at,qq=${meta.userId}]` + "\n请指明图池中各mod数量（不含TB），例如：!rnew NM3 HD2 HR2 DT3");
            let mods = [];
            let amount = [];
            arg.map((value) => {
                mods.push(value.replace(/[0-9]/ig, ""));
                amount.push(parseInt(value.replace(/[^0-9]/ig, "")));
            });
            rollCollector[qqId] = new Roller(mods, amount);
            return meta.$send( `[CQ:at,qq=${meta.userId}]` + "\n创建成功！\n" +rollCollector[qqId].info() + "\n输入!rnext开始roll图");
        }
        if (msg.indexOf("rdelete") >= 0) {
            delete rollCollector[qqId];
            return meta.$send(`[CQ:at,qq=${meta.userId}]` + "\n已删除您的roll点图池");
        }
        return next();
    } catch (ex) {
        console.log(ex);
        return next();
    }

}


