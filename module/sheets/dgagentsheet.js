import * as Dice from "../dice.js";

export default class DgAgentSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions,
            {
                template: "systems/delta-green-alt/templates/sheets/agent-sheet.hbs",
                classes: ["dgalt", "sheet", "agent"],
                width: 720,
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

        data.weapons = data.items.filter(function (item) { return (item.type == "Weapon" && item.data.isequiped) });

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

        data.equipedarmor = data.items.filter(function (item) { return (item.type == "Armor" && item.data.isequiped) });

        data.equipedarmor.sort(function (a, b) {
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

        let totalArmor=0;
        for (let element of data.equipedarmor) {
            
            totalArmor += Number(element.data.protection);
            
        }
        this.actor.system.armorvalue = totalArmor;



        data.gearlist = data.items.filter(function (item) { return item.data.isgear });

        for (let element of data.gearlist) {

            element.sortPath = this.getContainerPath(data.gearlist, element, element.sortDepth);
            element.sortDepth = element.sortPath.split("|").length - 1;
            //console.log(element.sortPath+" D:"+element.sortDepth)
        }


        data.gearlist.sort(function (a, b) {
           
            let combinedA = a.sortPath;
            let combinedB = b.sortPath;

            if (a.sortPath < b.sortPath) {
                return -1;
            }
            if (a.sortPath > b.sortPath) {
                return 1;
            }
            return 0;






        });

        return data;
    }

    getContainerPath(list, item) {
        let name = item.name.toUpperCase();
        let container = item.data.container.toUpperCase();

        if (container == "" || name == container) return name;

        for (let listitem of list) {
            let listname = listitem.name.toUpperCase();
            if (container == listname) {
                let sortPath = this.getContainerPath(list, listitem);
                sortPath = sortPath + "|" + name;
                return sortPath;

            }
        }

        return container + "|" + name;


    }



    skillContextMenu = [
        {
            name: game.i18n.localize("dgalt.contextmenu.edit"),
            icon: '<i class="fas fa-edit"/>',
            callback: element => {
                //console.log(this.actor.name);
                const item = this.actor.items.get(element.data("item-id"));
                item.sheet.render(true);
            }


        },
        {
            name: game.i18n.localize("dgalt.contextmenu.delete"),
            icon: '<i class="fas fa-trash"/>',
            callback: element => {
                //console.log(this.actor.name);
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
        html.find(".weapon-reload").click(this._onReloadClick.bind(this));
        

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
        if (element.dataset.isactor) {
            const field=element.dataset.field;
            this.actor.update( { [field] : !getProperty(this.actor.data, field) } );

        } else {
            const itemId = element.closest(".item").dataset.itemId;
            const item = this.actor.items.get(itemId);
            const field = element.dataset.field;
            return item.update({ [field]: !getProperty(item.data, field) });
        }
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
                if (item.system.failcheck) {


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
            adaptlevel = this.actor.system.sanity.violencelevel;
            if (adaptlevel != number)
                this.actor.update({ ["system.sanity.violencelevel"]: number });
            else
                this.actor.update({ ["system.sanity.violencelevel"]: number - 1 });
        }
        if (element.dataset.adapt == "helplessness") {
            adaptlevel = this.actor.system.sanity.helplessnesslevel;
            if (adaptlevel != number)
                this.actor.update({ ["system.sanity.helplessnesslevel"]: number });
            else
                this.actor.update({ ["system.sanity.helplessnesslevel"]: number - 1 });
        }
    }

    async _onColorToggleClick(event) {

        this.actor.update({ ["system.options.colorhighlight"]: !this.actor.system.options.colorhighlight });

    }

    async _onEditWeaponToggleClick(event) {

        this.actor.update({ ["system.options.editweapons"]: !this.actor.system.options.editweapons });

    }

    async _onReloadClick(event)
    {
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        item.update({["system.ammocurrent"]: item.system.ammomax });
    }

    async _onItemRollClick(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const rolltype = element.dataset.rolltype;
        const icon = element.dataset.icon;
        const label = element.dataset.label;
        const description = element.dataset.description;
        const basetarget = element.dataset.basetarget;
        const mod = element.dataset.mod;
        const targetfield = element.dataset.targetfield;

        if (rolltype == "skill") {
            const itemId = element.closest(".item").dataset.itemId;
            const item = this.actor.items.get(itemId);
            const header = game.i18n.localize("dgalt.labels.rolls.skilltest")
            //item.roll(mod,targetfield);
            let sucess = await Dice.skillTest(header, icon, label, "", basetarget, mod);
            if (!sucess) item.update({ ["data.failcheck"]: true });
        }

        if (rolltype == "weapon") {
            const itemId = element.closest(".item").dataset.itemId;
            const item = this.actor.items.get(itemId);
            const skill = this.actor.getSkillByName(game.i18n.localize("dgalt.attackskills." + item.system.attackskill));

            const header = game.i18n.localize("dgalt.labels.rolls.attack")
            //item.roll(mod,targetfield);
            let sucess = false;

            if(item.system.usesammo)
            {
                if( item.system.ammocurrent>0)
                {
                item.update({["system.ammocurrent"]: item.system.ammocurrent-1 });
                }
                else
                {
                    //ChatMessage.create("OUT OF AMMO!")
                    AudioHelper.play({src: "sounds/notify.wav", volume: 0.8, loop: false}, true);
                    return;
                }
            }

            if (skill) sucess = await Dice.skillTest(header, icon, label, "using " + skill.name, basetarget, mod);
            if (skill && !sucess) skill.update({ ["system.failcheck"]: true });
        }


        if (rolltype == "damage") {
            const itemId = element.closest(".item").dataset.itemId;
            const item = this.actor.items.get(itemId);
            const header = game.i18n.localize("dgalt.labels.rolls.damage");
            const dmgformula = element.dataset.dmgformula;
            const mult = element.dataset.mult;
            Dice.damageRoll(header, icon, label, "", dmgformula, mult);

        }
        if (rolltype == "lethality") {
            const itemId = element.closest(".item").dataset.itemId;
            const item = this.actor.items.get(itemId);
            const header = game.i18n.localize("dgalt.labels.rolls.lethality");
            const lethality = element.dataset.lethality;
            const mult = element.dataset.mult;
            Dice.lethalityRoll(header, icon, label, "", lethality, mult);

        }

        if (rolltype == "post") {
            Dice.postDescription(icon, label, basetarget, description);
        }

        if (rolltype == "agent") {
            //this.actor.roll(mod,targetfield)

            const header = game.i18n.localize("dgalt.labels.rolls.stattest");
            Dice.skillTest(header, icon, label, "", basetarget, mod);
        }
    }

    async _onBreakpointClick(event) {
        event.preventDefault();
        this.actor._setBreakPoint();
    }

}