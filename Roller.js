"use strict";

class Roller {
    /**
     * @param {Array<String>} mods 模式，一般不能有TB，比如["NM", "DT", "HD", "HR"]
     * @param {Array<Number>} amount 各模式的谱面数量，比如[6,3,2,1]
     */
    constructor(mods, amount) {
        // 记录该图池的原始信息
        this.pollMods = mods;
        this.pollAmount = amount;
        // roll点就是将所有谱面组成一维数组roll
        this.beatmapCount = amount.reduce(function (sum, number) {
            return sum + number;
        });
        this.beatmapCodeNames = this.setBeatmapCodeName();
        this.rollCount = 0;
    }

    /**
     * 获取0-max的随机整数，不包括max
     * @param {Number} max 最大数值
     */
    getRandomInt(max) {
        return Math.floor(Math.random() * max) ;
    }

    setBeatmapCodeName() {
        let beatmapCodeName = [];
        this.pollAmount.map((value, index) => {
            let i = 1;
            while (i <= value) {
                beatmapCodeName.push(this.pollMods[index] + i);
                i = i + 1;
            }
        });
        return beatmapCodeName;
    }

    info() {
        let output = "共有";
        this.pollAmount.map((value, index) => {
            output = output + value + "个" + this.pollMods[index] + "，";
        });
        return output;
    }

    roll() {
        if (this.beatmapCodeNames.length <= 0) return "图池里所有图都打过了";
        let index = this.getRandomInt(this.beatmapCodeNames.length);
        this.rollCount = this.rollCount + 1;
        let beatmapName = this.beatmapCodeNames[index];
        this.beatmapCodeNames.splice(index, 1);
        return "Round " + this.rollCount + "：" + beatmapName;
    }

}

module.exports = Roller;
