const chatTemplate = {
    "Post": "systems/delta-green-alt/templates/partials/post-skill.hbs",
    "SkillImprovement": "systems/delta-green-alt/templates/partials/roll-skill-improve.hbs",
    "Check": "systems/delta-green-alt/templates/partials/skill-check.hbs",
}

export async function skillTest(header, icon, label, description, basetarget, mod, critstat){

    


    let roll = new Roll('1D100');
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
    let target = Number(basetarget)+Number(mod);
    let criticalmin = 1;
    if(critstat) criticalmin = critstat;
    target=Math.min(target,99);
    if (roll.total <= target) success = true;
    let critical = false;
    if (!(roll.total % 11) || roll.total == 100 || roll.total<=criticalmin) critical = true;


    let cardData = {
        img: icon,
        name: label,
        description: description,
        header : header,
        base:basetarget,
        mod:mod, 
        target: target,
        success: success,
        critical: critical,
        flavor: roll.flavor,
        formula: roll.formula,
        total: roll.total,
        tooltip: tooltip
    };

    
    chatData.content = await renderTemplate(chatTemplate["Check"], cardData);

    ChatMessage.create(chatData);
    return success;

}


export async function postDescription(icon, label, value, description){
    let chatData = {
        user: game.userId,
        speaker: ChatMessage.getSpeaker(),
        //flavor: "Skill Check",
        roll: true,
        rollMode: game.settings.get("core", "rollMode")
    };

    let cardData = {
        img:icon,
        name:label,
        value:value,
        description:description                
    };

    chatData.content = await renderTemplate(chatTemplate["Post"], cardData);
    //AudioHelper.play({src: "sounds/drums.wav", volume: 0.8, loop: false}, true);
    //AudioHelper.play({src: "sounds/dice.wav", volume: 0.8, loop: false}, true);
    //AudioHelper.play({src: "sounds/lock.wav", volume: 0.8, loop: false}, true);
    AudioHelper.play({src: "sounds/notify.wav", volume: 0.8, loop: false}, true);

    return ChatMessage.create(chatData);
}