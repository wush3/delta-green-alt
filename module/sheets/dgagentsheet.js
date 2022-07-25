export default class DgAgentSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions,
            {
                template: "systems/delta-green-alt/templates/sheets/agent-sheet.hbs",
                classes: ["dgalt", "sheet", "agent"]
            });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dgalt;
        data.skills = data.items.filter(function (item) { return item.type == "Skill" });
        data.bonds = data.items.filter(function (item) { return item.type == "Bond" });
        return data;
    }

    activateListeners(html) {


        html.find(".item-create").click(this._onItemCreate.bind(this));
        html.find(".item-delete").click(this._onItemDelete.bind(this));
        html.find(".item-edit").click(this._onItemEdit.bind(this));
        html.find(".item-checkmark").click(this._onCheckboxClick.bind(this));

        html.find(".inline-edit").change(this._onInlineChanged.bind(this));
        

        

        super.activateListeners(html);
    }

    async _onItemCreate(event) { 
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;
                
        let itemData={
            name: game.i18n.localize("dgalt.sheet.newItem"),           
            type: type,
            data: foundry.utils.deepClone(header.dataset)
        }

        console.log(itemData.name);
        console.log(itemData.type);

        delete itemData.data.type;
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }
    
    async _onItemDelete(event) {
        event.preventDefault();
        const li = event.currentTarget.closest(".item");
        const item = this.actor.items.get(li.dataset.itemId);
        if ( !item ) return;
        return item.delete();
      }
    
    async _onItemEdit(event) { 
        event.preventDefault();
        const li = event.currentTarget.closest(".item");
        const item = this.actor.items.get(li.dataset.itemId);
        return item.sheet.render(true);
    }

    async _onCheckboxClick(event) {
        event.preventDefault();    
        const element= event.currentTarget;    
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        const field=element.dataset.field;
        return item.update({[field]: !getProperty(item.data, field)});
    }


    async _onInlineChanged(event){
        event.preventDefault();
        const element= event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        const item=this.actor.items.get(itemId);
        const field=element.dataset.field;
        return item.update({[field]: element.value});
    }

}