import {dgalt} from "./config.js";
import DgItem from "./dgitem.js";
import DgActor from "./dgactor.js";
import DgItemSheet from "./sheets/dgitemsheet.js";
import DgAgentSheet from "./sheets/dgagentsheet.js";

import * as Dice from "./dice.js";

async function preloadHandlebarsTemplates()
{
    const templatePaths=[
        "systems/delta-green-alt/templates/partials/agent-personal-data-block.hbs",
        "systems/delta-green-alt/templates/partials/agent-statistics-data-block.hbs",
        "systems/delta-green-alt/templates/partials/agent-psychological-data.hbs",
        "systems/delta-green-alt/templates/partials/agent-skills-data-block.hbs",
        "systems/delta-green-alt/templates/partials/agent-weapons-data-block.hbs",
        "systems/delta-green-alt/templates/partials/agent-armor-data-block.hbs",
        "systems/delta-green-alt/templates/partials/agent-gear-data-block.hbs",

        "systems/delta-green-alt/templates/partials/bond-card.hbs",
        "systems/delta-green-alt/templates/partials/skill-card.hbs",
        "systems/delta-green-alt/templates/partials/mental-card.hbs",
        "systems/delta-green-alt/templates/partials/weapon-card.hbs",

        "systems/delta-green-alt/templates/partials/post-skill.hbs",
        "systems/delta-green-alt/templates/partials/skill-check.hbs",
        "systems/delta-green-alt/templates/partials/roll-skill-improve.hbs",
        
    ];

    return loadTemplates(templatePaths);
}

Hooks.once("init", async function()
    {
        console.log('delta-green-alt | Alternative Delta Green system initializing....');

        CONFIG.dgalt=dgalt;

        CONFIG.Item.documentClass = DgItem;
        CONFIG.Actor.documentClass = DgActor;

        Items.unregisterSheet("core", ItemSheet); 
        Items.registerSheet("delta-green-alt", DgItemSheet);

        Actors.unregisterSheet("core",ActorSheet);
        Actors.registerSheet("delta-green-alt",DgAgentSheet);

        preloadHandlebarsTemplates();

        Handlebars.registerHelper("times", function(n, content)
        {
            let resut="";
            for(let i=0;i<n;i++)
            {
                result+=content.fn(i);
            }
            return resut;
        });

        Handlebars.registerHelper("pickcolor", function(content)
        {
            let result="eighty";
            if (content<80) result="sixty";
            if (content<60) result="forty";
            if (content<40) result="twenty";
            if (content<20) result="belowtwenty";
            if (content<1) result="zero";
            
            return result;
        });

        Handlebars.registerHelper("add", function(param1, param2)
        {
            return Number(param1)+Number(param2);
            
        });

        Handlebars.registerHelper("selectattack", function(attacks, key)
        {
            return Number(attacks[key]);
            
        });

        Handlebars.registerHelper("selectattackmod", function(attacks, key, mod)
        {
            return Number(attacks[key])+Number(mod);
            
        });

        

        
    }
);