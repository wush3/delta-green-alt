export default class DgItem extends Item {

    chatTemplate = {
        "Skill": "systems/delta-green-alt/templates/partials/roll-skill.hbs",
        "SkillImprovement": "systems/delta-green-alt/templates/partials/roll-skill-improve.hbs"
    }

    async rollImprovement() {
        let roll = new Roll('1D4', this.actor.data);
        await roll.evaluate({ async: true });
        let newvalue=Number(this.data.data.value) + Number(roll.total);
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
        chatData.content = await renderTemplate(this.chatTemplate["SkillImprovement"], cardData) ;
        


        this.update({ ["data.value"]: newvalue })

        this.update({ ["data.failcheck"]: false });

        return ChatMessage.create(chatData)

    }

    async roll() {
        let roll = new Roll('1D100', this.actor.data.data)
        await roll.evaluate({ async: true });

        let chatData = {
            user: game.userId,
            speaker: ChatMessage.getSpeaker(),
            flavor: "Skill Check",
            type: 5,
            roll: roll,
            rollMode: game.settings.get("core", "rollMode")
        };


        let cardData = {
            ...this.data,
            owner: this.actor.id,
        };

        let html = ""
        AudioHelper.play({ src: "sounds/dice.wav", volume: 0.8, autoplay: true, loop: false }, true);


        chatData.content = await renderTemplate(this.chatTemplate[this.type], cardData);
        chatData.content+="<p>Roll Total:"+roll.total+"</p>";
        if(roll.total<=this.data.data.value)
        chatData.content+="<p>PASS</p>"; else
        chatData.content+="<p>FAIL</p>";
        if(!(roll.total % 11)||roll.total==100) chatData.content+="<p>CRITICAL</p>";

        return ChatMessage.create(chatData);
    }

} 