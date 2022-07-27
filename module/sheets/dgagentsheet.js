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

        data.skills.sort(function (a, b) {
            let nameA = a.name.toUpperCase();
            let nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        data.bonds = data.items.filter(function (item) { return item.type == "Bond" });
    

        data.bonds.sort(function (a, b) {
            let nameA = a.name.toUpperCase();
            let nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        data.mentalitems = data.items.filter(function (item) { return item.type == "Mental" });
        
        data.mentalitems.sort(function (a, b) {
            let nameA = a.name.toUpperCase();
            let nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        return data;
    }

    skillContextMenu = [
        {
            name: game.i18n.localize("dgalt.labels.contextmenu.edit"),
            icon: '<i class="fas fa-edit"/>',
            callback: element => {
                console.log(this.actor.name);
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
            }


        },
        {
            name: game.i18n.localize("dgalt.labels.contextmenu.delete"),
            icon: '<i class="fas fa-trash"/>',
            callback: element => {
                console.log(this.actor.name);
                const item = this.actor.items.get(element.data("item-id"));
                if (!item) return;
                return item.delete();
            }
        }


    ]




    activateListeners(html) {


        html.find(".item-create").click(this._onItemCreate.bind(this));
        html.find(".item-delete").click(this._onItemDelete.bind(this));
        html.find(".item-edit").click(this._onItemEdit.bind(this));
        html.find(".item-checkmark").click(this._onCheckboxClick.bind(this));
        html.find(".skill-improvement").click(this._onImproveClick.bind(this));
        html.find(".violence-checkmark").click(this._onViolenceClick.bind(this));

        html.find(".inline-edit").change(this._onInlineChanged.bind(this));


        new ContextMenu(html, ".skill-card", this.skillContextMenu);




        super.activateListeners(html);
    }

    async _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;

        let itemData = {
            name: game.i18n.localize("dgalt.sheet.newItem"),
            type: type,
            data: foundry.utils.deepClone(header.dataset)
        }

        delete itemData.data.type;
        return this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    async _onItemDelete(event) {
        event.preventDefault();
        const li = event.currentTarget.closest(".item");
        const item = this.actor.items.get(li.dataset.itemId);
        if (!item) return;
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
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        const field = element.dataset.field;
        return item.update({ [field]: !getProperty(item.data, field) });
    }


    async _onInlineChanged(event) {
        event.preventDefault();        
        const element = event.currentTarget;        
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);        
        const field = element.dataset.field;        
        //return item.update({ [field]: element.value });
        const result=item.update({ [`${field}`]: element.value })
        this.actor.update();
        return result;

        
    }

    async _onImproveClick(event) {

        
        this.actor.items.forEach(item => {
           
            if(item.type=="Skill")            
                if(item.data.data.failcheck)
                {
                    //send a basic chatmessage later

                    item.update({["data.value"]: getProperty(item.data,"data.value") + Math.floor(Math.random() * 4)+1})

                    item.update({["data.failcheck"]:false});
                   
                   
                }
        });

        return;
    }

    async _onViolenceClick(event){
        event.preventDefault();
        const element = event.currentTarget;
        const violencelevel=this.actor.data.data.sanity.violencelevel;
        const number=element.dataset.number;
        if(violencelevel!=number)
            this.actor.update({["data.sanity.violencelevel"]:number});
        else
            this.actor.update({["data.sanity.violencelevel"]:number-1});
               
    }

}