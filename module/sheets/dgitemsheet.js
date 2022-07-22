export default class DgItemSheet extends ItemSheet {

    get template(){        
        const path = "systems/delta-green-alt/templates/sheets";
        // unique item sheet by type, like `weapon-sheet.html`.
        return `${path}/${this.item.data.type}-sheet.html`; 
    }

    getData()
    {
        const data = super.getData();
        data.config=CONFIG.dgalt;
        return data;
    }

}