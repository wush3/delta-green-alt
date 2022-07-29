export default class DgActor extends Actor {
    prepareData() {
        super.prepareData();

        const actorData = this.data;
        const _data = actorData.data;
        const _flags = actorData.flags;

        console.log('actor.js prepareData');
        console.log(this);

        let pow = 0;

        for (let [key, statistic] of Object.entries(_data.statistics)) {
           
            let statfield="data.statistics."+key+".x5";
            let statx5=statistic.value * 5;

            this.update({[statfield]:statx5});
            if (key == "power") pow = statistic.value;           
        }

        let maxhp=Math.ceil((_data.statistics.constitution.value + _data.statistics.strength.value) / 2) ;
        this.update({["data.health.max"]: maxhp});

        let unnatural = this.data.items.find(function (item) {
            return (item.type == "Skill" && item.name == "Unnatural")
        })

        if (unnatural && unnatural.data.data.value)
            this.update({["data.sanity.max"]: 99 - unnatural.data.data.value });
            //_data.sanity.max = 99 - unnatural.data.data.value;
        else
            this.update({["data.sanity.max"]: 99 });
            //_data.sanity.max = 99;

        if (_data.sanity.value > _data.sanity.max) this.update({["data.sanity.value"]:_data.sanity.max})
        //_data.sanity.value = _data.sanity.max;

        if (_data.sanity.currentbreakingpoint > 99)
            this._setBreakPoint();        
    }

    _setBreakPoint(){
        let newbreak=this.data.data.sanity.value-this.data.data.statistics.power.value;
        
        this.update({["data.sanity.currentbreakingpoint"]:newbreak})
        
        
    }


}