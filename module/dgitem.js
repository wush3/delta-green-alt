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
        "Post": "systems/delta-green-alt/templates/partials/post-skill.hbs",
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


    async roll(mod,targetfield) {

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

            let roll = new Roll('1D100', this.actor.data.data)
            await roll.evaluate({ async: true });
            let tooltip = await roll.getTooltip();
            
            chatData.roll=roll;
            chatData.type=5;

            let success = false;
            let target = this.data.data[targetfield]+mod;
            if (roll.total <= target) success = true;
            let critical = false;
            if (!(roll.total % 11) || roll.total == 100) critical = true;


            let cardData = {
                ...this.data,
                owner: this.actor.id,
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
        }else
        {

            let cardData = {
                ...this.data,
                owner: this.actor.id,                
            };

            chatData.content = await renderTemplate(this.chatTemplate["Post"], cardData);
            //AudioHelper.play({src: "sounds/drums.wav", volume: 0.8, loop: false}, true);
            //AudioHelper.play({src: "sounds/dice.wav", volume: 0.8, loop: false}, true);
            //AudioHelper.play({src: "sounds/lock.wav", volume: 0.8, loop: false}, true);
            AudioHelper.play({src: "sounds/notify.wav", volume: 0.8, loop: false}, true);

            return ChatMessage.create(chatData);

        }
    }

} 