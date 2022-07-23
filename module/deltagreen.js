import {dgalt} from "./config.js";
import DgItemSheet from "./sheets/dgitemsheet.js";
import DgAgentSheet from "./sheets/dgagentsheet.js";

Hooks.once("init", async function()
    {
        console.log('delta-green-alt | Alternative Delta Green system initializing....');

        CONFIG.dgalt=dgalt;

        Items.unregisterSheet("core", ItemSheet); 
        Items.registerSheet("delta-green-alt", DgItemSheet);

        Actors.unregisterSheet("core",ActorSheet);
        Actors.registerSheet("delta-green-alt",DgAgentSheet);

    }
);