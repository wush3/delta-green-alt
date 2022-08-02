export default class DgItem extends Item {


    
/*
    prepareDerivedData() {
        super.prepareDerivedData();

        if (this.actor && this.type == "Weapon") {


            let result = this.actor.getStatx5ValueByName("strength");
            
            if(result!=-1)
                this.data.data.attackvalue = result;


        }
    }*/


    chatTemplate = {
        "Skill": "systems/delta-green-alt/templates/partials/roll-skill.hbs",
        "SkillImprovement": "systems/delta-green-alt/templates/partials/roll-skill-improve.hbs",
        "Check": "systems/delta-green-alt/templates/partials/skill-check.hbs",
    }

    async rollImprovement() {
        let roll = new Roll('1D4', this.actor.data);
        await roll.evaluate({ async: true });
        let newvalue = Number(this.data.data.value) + Number(roll.total);
        let chatData = {
            user: game.userId,
            speaker: ChatMessage.getSpeaker(),
            flavor: "Skill Improvement",
            type: 5,
            roll: roll,
            rollMode: game.settings.get("core", "rollMode")
        };
        let cardData = {
            ...this.data,
            owner: this.actor.id,
            rollresult: roll,
            newskillvalue: newvalue
        };
        AudioHelper.play({ src: "sounds/dice.wav", volume: 0.8, autoplay: true, loop: false }, true);
        chatData.content = await renderTemplate(this.chatTemplate["SkillImprovement"], cardData);



        this.update({ ["data.value"]: newvalue })

        this.update({ ["data.failcheck"]: false });

        return ChatMessage.create(chatData)

    }


    async roll() {
        let roll = new Roll('1D100', this.actor.data.data)
        await roll.evaluate({ async: true });
        let tooltip = await roll.getTooltip();
        let chatData = {
            user: game.userId,
            speaker: ChatMessage.getSpeaker(),
            //flavor: "Skill Check",
            type: 5,
            roll: roll,
            rollMode: game.settings.get("core", "rollMode")
        };

        let success = false;
        if (roll.total <= this.data.data.value) success = true;
        let critical = false;
        if (!(roll.total % 11) || roll.total == 100) critical = true;


        let cardData = {
            ...this.data,
            owner: this.actor.id,
            success: success,
            critical: critical,
            flavor: roll.flavor,
            formula: roll.formula,
            total: roll.total,
            tooltip: tooltip
        };

        let html = ""
        //AudioHelper.play({ src: "sounds/dice.wav", volume: 0.8, autoplay: true, loop: false }, true);

        //chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);
        chatData.content = await renderTemplate(this.chatTemplate["Check"], cardData);

        return ChatMessage.create(chatData);
    }

} 