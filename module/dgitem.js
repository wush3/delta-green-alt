export default class DgItem extends Item{

    chatTemplate={
        "Skill":"systems/delta-green-alt/templates/partials/roll-skill.hbs"
    }

    async roll()
    {
        let roll = new Roll('1D100', this.actor.data.data)  
        await roll.evaluate({async: true});

        let chatData={
            user:game.userId,
            speaker:ChatMessage.getSpeaker(),
            flavor:"FLAVOR",
            //type: 5,
            //roll: roll,
            //rollMode: game.settings.get("core", "rollMode")
        };
       

        let cardData={
            ...this.data,
            owner: this.actor.id,           
        };

       let html=""
        AudioHelper.play({src: "sounds/dice.wav", volume: 0.8, autoplay: true, loop: false}, true);
  
        
        chatData.content= await renderTemplate(this.chatTemplate[this.type], cardData);

        return ChatMessage.create(chatData)
    }

} 