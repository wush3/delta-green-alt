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
        return `${path}/${this.item.data.type}-sheet.hbs`.toLowerCase();;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.dgalt;

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