export default class DgActor extends Actor {
    prepareData() {
        super.prepareData();

        const actorData = this.data;
        const _data = actorData.data;
        const _flags = actorData.flags;

        console.log('actor.js prepareData');
        console.log(this);

        

        let pow = 0;

        for (let [key, statistic] of Object.entries(_data.statistics)) {

            let statfield = "data.statistics." + key + ".x5";
            let statx5 = statistic.value * 5;

            //this.update({[statfield]:statx5});

            _data.statistics[key].x5 = statx5;
            if (key == "power") pow = statistic.value;
        }

        let maxhp = Math.ceil((_data.statistics.constitution.value + _data.statistics.strength.value) / 2);
        //this.update({["data.health.max"]: maxhp});
        this.data.data.health.max = maxhp;
        this.data.data.wp.max = pow;

        let unnatural = this.data.items.find(function (item) {
            return (item.type == "Skill" && item.name == "Unnatural")
        })

        if (unnatural && unnatural.data.data.value)
            //this.update({["data.sanity.max"]: 99 - unnatural.data.data.value });
            this.data.data.sanity.max = 99 - unnatural.data.data.value;
        else
            //this.update({["data.sanity.max"]: 99 });
            this.data.data.sanity.max = 99;

        if (_data.sanity.value > _data.sanity.max) //this.update({["data.sanity.value"]:_data.sanity.max})
            this.data.data.sanity.value = this.data.data.sanity.max;

        //if (_data.sanity.currentbreakingpoint > 99)
        //    this._setBreakPoint();    

        _data.attacks.none=0;
        _data.attacks.unarmedcombat = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.unarmedcombat"));
        _data.attacks.meleeweapons = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.meleeweapons"));
        _data.attacks.dextimesfive = _data.statistics["dexterity"].x5;
        _data.attacks.athletics = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.athletics"));
        _data.attacks.firearms = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.firearms"));
        _data.attacks.heavyweapons  = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.heavyweapons"));
        _data.attacks.demolitions = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.demolitions"));
        _data.attacks.artillery = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.artillery"));

    }

    prepareDerivedData() {

        super.prepareDerivedData();

        const actorData = this.data;
        const _data = actorData.data;
        const _flags = actorData.flags;


    }

    _setBreakPoint() {
        let newbreak = this.data.data.sanity.value - this.data.data.statistics.power.value;

        this.update({ ["data.sanity.currentbreakingpoint"]: newbreak })
        //this.data.data.sanity.currentbreakingpoint=newbreak;       
    }

    static async create(data, options = {}) {

        data.token = data.token || {}

        if (data.type === 'Agent') {
            mergeObject(
                data.token,
                {
                    vision: true,
                    dimSight: 30,
                    brightSight: 0,
                    actorLink: true,
                    disposition: 1
                },
                { overwrite: false }
            );

        }

        return super.create(data, options);
    }


    getSkillValueByName(skillname) {
        let skillitem = this.data.items.find(
            item => {
                console.log(item.name == skillname);
                return item.name == skillname

            });
        if (skillitem)
            return skillitem.data.data.value;
        return null;
    }

    getStatx5ValueByName(statname) {
        let result = -1;

        if (this.data && this.data.data.statistics[statname].x5)

            result = Number(this.data.data.statistics[statname].x5);
        //console.log(">>>statx5 lookup:" + result);
        //console.log(">>rawrepeat:" + this.data.data.statistics[statname].x5)

        return result;

    }

    chatTemplate = {
        "Post": "systems/delta-green-alt/templates/partials/post-skill.hbs",
        "SkillImprovement": "systems/delta-green-alt/templates/partials/roll-skill-improve.hbs",
        "Check": "systems/delta-green-alt/templates/partials/skill-check.hbs",
    }

    byString = function (o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }

    async roll(mod, targetfield) {

        let chatData = {
            user: game.userId,
            speaker: ChatMessage.getSpeaker(),
            //flavor: "Skill Check",
            //type: 5,
            roll: true,
            rollMode: game.settings.get("core", "rollMode")
        };

        if (mod != "comment") {

            mod = Number(mod);

            let roll = new Roll('1D100', this.data.data)
            await roll.evaluate({ async: true });
            let tooltip = await roll.getTooltip();

            chatData.roll = roll;
            chatData.type = 5;

            let success = false;
            let target = this.byString(this.data.data, targetfield) + mod//this.data.data[targetfield]+mod;
            if (roll.total <= target) success = true;
            let critical = false;
            if (!(roll.total % 11) || roll.total == 100) critical = true;


            let cardData = {
                ...this.data,
                owner: this.id,
                header: game.i18n.localize("dgalt.labels.rolls.stattest"),
                target: target,
                success: success,
                critical: critical,
                flavor: roll.flavor,
                formula: roll.formula,
                total: roll.total,
                tooltip: tooltip
            };


            chatData.content = await renderTemplate(this.chatTemplate["Check"], cardData);

            return ChatMessage.create(chatData);
        } else {

            let cardData = {
                ...this.data,
                owner: this.id,
            };

            chatData.content = await renderTemplate(this.chatTemplate["Post"], cardData);
            //AudioHelper.play({src: "sounds/drums.wav", volume: 0.8, loop: false}, true);
            //AudioHelper.play({src: "sounds/dice.wav", volume: 0.8, loop: false}, true);
            //AudioHelper.play({src: "sounds/lock.wav", volume: 0.8, loop: false}, true);
            AudioHelper.play({ src: "sounds/notify.wav", volume: 0.8, loop: false }, true);

            return ChatMessage.create(chatData);

        }
    }
}