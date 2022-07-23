export default class DgAgentSheet extends ActorSheet {

    static get defaultOptions()
    {
        return mergeObject(super.defaultOptions,
            {      
                template:"systems/delta-green-alt/templates/sheets/agent-sheet.hbs",          
                classes:["dgalt","sheet",,"agent"]
            });
    }    

    getData()
    {
        const data = super.getData();
        data.config=CONFIG.dgalt;
        return data;
    }

}