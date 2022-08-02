export default class DgActor extends Actor {
    prepareData() {
        super.prepareData();

        const actorData = this.data;
        const _data = actorData.data;
        const _flags = actorData.flags;

        console.log('actor.js prepareData');
        console.log(this);


    }

    prepareDerivedData() {

        super.prepareDerivedData();

        const actorData = this.data;
        const _data = actorData.data;
        const _flags = actorData.flags;

        let pow = 0;

        for (let [key, statistic] of Object.entries(_data.statistics)) {

            let statfield = "data.statistics." + key + ".x5";
            let statx5 = statistic.value * 5;

            //this.update({[statfield]:statx5});

            _data.statistics[key].x5 = statx5;
            if (key == "power") pow = statistic.value;
        }

        let maxhp = Math.ceil((_data.statistics.constitution.value + _data.statistics.strength.value) / 2);
        //this.update({["data.health.max"]: maxhp});
        this.data.data.health.max = maxhp;
        this.data.data.wp.max = pow;

        let unnatural = this.data.items.find(function (item) {
            return (item.type == "Skill" && item.name == "Unnatural")
        })

        if (unnatural && unnatural.data.data.value)
            //this.update({["data.sanity.max"]: 99 - unnatural.data.data.value });
            this.data.data.sanity.max = 99 - unnatural.data.data.value;
        else
            //this.update({["data.sanity.max"]: 99 });
            this.data.data.sanity.max = 99;

        if (_data.sanity.value > _data.sanity.max) //this.update({["data.sanity.value"]:_data.sanity.max})
            this.data.data.sanity.value = this.data.data.sanity.max;

        //if (_data.sanity.currentbreakingpoint > 99)
        //    this._setBreakPoint();       
    }

    _setBreakPoint() {
        let newbreak = this.data.data.sanity.value - this.data.data.statistics.power.value;

        this.update({ ["data.sanity.currentbreakingpoint"]: newbreak })
        //this.data.data.sanity.currentbreakingpoint=newbreak;       
    }

    static async create(data, options = {}) {

        data.token = data.token || {}

        if (data.type === 'Agent') {
            mergeObject(
                data.token,
                {
                    vision: true,
                    dimSight: 30,
                    brightSight: 0,
                    actorLink: true,
                    disposition: 1
                },
                { overwrite: false }
            );

        }

        return super.create(data, options);
    }


    getSkillValueByName(skillname) {
        let skillitem = this.data.items.find(
            item => {
                console.log(item.name == skillname);
                return item.name == skillname

            });
        if (skillitem)
            return skillitem.data.data.value;
        return null;
    }

    getStatx5ValueByName(statname) {
        let result = -1;

        if (this.data && this.data.data.statistics[statname].x5)

            result = Number(this.data.data.statistics[statname].x5);
        console.log(">>>statx5 lookup:" + result);
        console.log(">>rawrepeat:" + this.data.data.statistics[statname].x5)

        return result;

    }
}