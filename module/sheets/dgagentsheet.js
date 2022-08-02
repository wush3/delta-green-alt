export default class DgAgentSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions,
            {
                template: "systems/delta-green-alt/templates/sheets/agent-sheet.hbs",
                classes: ["dgalt", "sheet", "agent"],
                width: 700,
                height: 760,                
                resizable: true,
                scrollY: ['.skills-block .bonds-block .mental-block .tab .right-panel'],                
                tabs: [
                    {
                        navSelector: '.sheet-nav',
                        contentSelector: '.sheet-body',
                        initial: 'skills'
                    }
                ]
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

        data.weapons = data.items.filter(function (item) { return item.type == "Weapon" });

        data.weapons.sort(function (a, b) {
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
            name: game.i18n.localize("dgalt.contextmenu.edit"),
            icon: '<i class="fas fa-edit"/>',
            callback: element => {
                console.log(this.actor.name);
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
            }


        },
        {
            name: game.i18n.localize("dgalt.contextmenu.delete"),
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
        html.find(".adaptation-checkmark").click(this._onAdaptationClick.bind(this));
        html.find(".color-toggle").click(this._onColorToggleClick.bind(this));
        html.find(".editweapon-toggle").click(this._onEditWeaponToggleClick.bind(this));
        html.find(".breakpoint-click").click(this._onBreakpointClick.bind(this));

        html.find(".inline-edit").change(this._onInlineChanged.bind(this));

        //if (this.actor.owner) {
        html.find(".item-roll").click(this._onItemRollClick.bind(this));
        //}


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
        const dtype = element.dataset.dtype;

        let newValue = element.value;
        if (dtype == "number")
            newValue = Number(newValue);

        const result = item.update({ [`${field}`]: newValue })

        return result;


    }

    async _onImproveClick(event) {


        this.actor.items.forEach(item => {

            if (item.type == "Skill")
                if (item.data.data.failcheck) {
                    
                    
                    item.rollImprovement();
                    

                    
                }
        });

        return;
    }

    async _onAdaptationClick(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const number = element.dataset.number;
        let adaptlevel = 0;

        if (element.dataset.adapt == "violence") {
            adaptlevel = this.actor.data.data.sanity.violencelevel;
            if (adaptlevel != number)
                this.actor.update({ ["data.sanity.violencelevel"]: number });
            else
                this.actor.update({ ["data.sanity.violencelevel"]: number - 1 });
        }
        if (element.dataset.adapt == "helplessness") {
            adaptlevel = this.actor.data.data.sanity.helplessnesslevel;
            if (adaptlevel != number)
                this.actor.update({ ["data.sanity.helplessnesslevel"]: number });
            else
                this.actor.update({ ["data.sanity.helplessnesslevel"]: number - 1 });
        }
    }

    async _onColorToggleClick(event)
    {
       
        this.actor.update({["data.options.colorhighlight"]:!this.actor.data.data.options.colorhighlight});

    }

    async _onEditWeaponToggleClick(event)
    {
       
        this.actor.update({["data.options.editweapons"]:!this.actor.data.data.options.editweapons});

    }

    async _onItemRollClick(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        item.roll();
    }

    async _onBreakpointClick(event) {
        event.preventDefault();
        this.actor._setBreakPoint();
    }

}