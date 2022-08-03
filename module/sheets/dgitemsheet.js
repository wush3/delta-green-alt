export default class DgItemSheet extends ItemSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions,
            {
                width: 360,
                height: 300,
                classes: ["dgalt", "sheet", "item"]
            });
    }

    get template() {
        const path = "systems/delta-green-alt/templates/sheets";
        // unique item sheet by type, like `weapon-sheet.html`.
        return `${path}/${this.item.data.type}-sheet.hbs`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dgalt;

        if (this.item.actor && this.item.type == "Weapon") {



            let attackskill = this.item.data.data.attackskill
            switch (attackskill) {
                case "none":
                    data.data.data.attackvalue = 0;
                    break;
                case "unarmedcombat":
                    data.data.data.attackvalue = this.item.actor.getSkillValueByName(game.i18n.localize("dgalt.attackskills.unarmedcombat"));
                    break;
                case "meleeweapons":
                    data.data.data.attackvalue = this.item.actor.getSkillValueByName(game.i18n.localize("dgalt.attackskills.meleeweapons"));
                    break;
                case "athletics":
                    data.data.data.attackvalue = this.item.actor.getSkillValueByName(game.i18n.localize("dgalt.attackskills.athletics"));
                    break;
                case "firearms":
                    data.data.data.attackvalue = this.item.actor.getSkillValueByName(game.i18n.localize("dgalt.attackskills.firearms"));
                    break;
                case "heavyweapons":
                    data.data.data.attackvalue = this.item.actor.getSkillValueByName(game.i18n.localize("dgalt.attackskills.heavyweapons"));
                    break;
                case "demolitions":
                    data.data.data.attackvalue = this.item.actor.getSkillValueByName(game.i18n.localize("dgalt.attackskills.demolitions"));
                    break;
                case "artillery":
                    data.data.data.attackvalue = this.item.actor.getSkillValueByName(game.i18n.localize("dgalt.attackskills.artillery"));
                    break;
                default:
                    data.data.data.attackvalue = this.item.actor.getStatx5ValueByName("dexterity");
                    break;
            }
           

        }
        return data;

    }





    activateListeners(html) {


        html.find(".item-checkmark").click(this._onCheckboxClick.bind(this));
        html.find(".inline-edit").change(this._onInlineChanged.bind(this));


        super.activateListeners(html);
    }



    async _onCheckboxClick(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const item = this.item;
        const field = element.dataset.field;
        return item.update({ [field]: !getProperty(item.data, field) });
    }


    async _onInlineChanged(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const item = this.item;
        const field = element.dataset.field;
        return item.update({ [field]: element.value });
    }



}