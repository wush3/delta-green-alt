export default class DgItem extends Item {

    prepareDerivedData() {
        super.prepareDerivedData();

       // if (this.actor && this.type == "Weapon")
       //     this.system.attackvalue = this.actor.system.atttacks[this.system.attackskill];

    }

    async rollImprovement() {
        let roll = new Roll('1D4', this.actor.data);
        await roll.evaluate({ async: true });
        let newvalue = Number(this.system.value) + Number(roll.total);
        let chatData = {
            user: game.userId,
            speaker: ChatMessage.getSpeaker(),
            //flavor: "Skill Improvement",
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
        chatData.content = await renderTemplate("systems/delta-green-alt/templates/partials/roll-skill-improve.hbs", cardData);



        this.update({ ["data.value"]: newvalue })

        this.update({ ["data.failcheck"]: false });

        return ChatMessage.create(chatData)

    }





} 