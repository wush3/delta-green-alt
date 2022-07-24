export default class DgItemSheet extends ItemSheet {

    static get defaultOptions()
    {
        return mergeObject(super.defaultOptions,
            {
                width:340,
                height:200,
                classes:["dgalt","sheet","item"]
            });
    }

    get template(){        
        const path = "systems/delta-green-alt/templates/sheets";
        // unique item sheet by type, like `weapon-sheet.html`.
        return `${path}/${this.item.data.type}-sheet.hbs`; 
    }

    getData()
    {
        const data = super.getData();
        data.config=CONFIG.dgalt;
        return data;
    }

}