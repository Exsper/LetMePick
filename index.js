"use strict";

const Roller = require("./Roller");

// Koishi插件名
module.exports.name = "letmepick";

// 插件处理和输出
module.exports.apply = (ctx) => {
	let rollCollector = {};

	ctx.middleware(async (meta, next) => {
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
	});
};