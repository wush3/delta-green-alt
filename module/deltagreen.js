import {dgalt} from "./config.js";
import DgItemSheet from "./sheets/dgitemsheet.js";
import DgAgentSheet from "./sheets/dgagentsheet.js";

async function preloadHandlebarsTemplates()
{
    const templatePaths=[
        "systems/delta-green-alt/templates/partials/agent-personal-data-block.hbs",
        "systems/delta-green-alt/templates/partials/agent-statistics-data-block.hbs",
        "systems/delta-green-alt/templates/partials/agent-psychological-data.hbs",
        "systems/delta-green-alt/templates/partials/agent-skills-data-block.hbs",

        "systems/delta-green-alt/templates/partials/bond-card.hbs",
        "systems/delta-green-alt/templates/partials/skill-card.hbs",
        "systems/delta-green-alt/templates/partials/mental-card.hbs",
    ];

    return loadTemplates(templatePaths);
}

Hooks.once("init", async function()
    {
        console.log('delta-green-alt | Alternative Delta Green system initializing....');

        CONFIG.dgalt=dgalt;

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

    }
);