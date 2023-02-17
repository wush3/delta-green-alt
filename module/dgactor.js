export default class DgActor extends Actor {
    prepareData() {
        super.prepareData();

        const actorData = this.data;
        const _data = actorData.data;
        const _flags = actorData.flags;

        //console.log('actor.js prepareData');
        //console.log(this);



        
        for (let [key, statistic] of Object.entries(_data.statistics)) {

            let statfield = "data.statistics." + key + ".x5";
            let statx5 = statistic.value * 5;

            

            _data.statistics[key].x5 = statx5;
            
        }

        let maxhp = Math.ceil((Number(_data.statistics.constitution.value) + Number(_data.statistics.strength.value)) / 2);
        let pow = Number(_data.statistics.power.value);
        
        
        this.system.health.max = maxhp;
        this.system.wp.max = pow;

        let unnatural = this.data.items.find(function (item) {
            return (item.type == "Skill" && item.name == "Unnatural")
        })

        if (unnatural && unnatural.system.value)
            //this.update({["data.sanity.max"]: 99 - unnatural.system.value });
            this.system.sanity.max = 99 - unnatural.system.value;
        else
            //this.update({["data.sanity.max"]: 99 });
            this.system.sanity.max = 99;

        if (_data.sanity.value > _data.sanity.max) //this.update({["data.sanity.value"]:_data.sanity.max})
            this.system.sanity.value = this.system.sanity.max;

        //if (_data.sanity.currentbreakingpoint > 99)
        //    this._setBreakPoint();    

        _data.attacks.none = 0;
        _data.attacks.unarmedcombat = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.unarmedcombat"));
        _data.attacks.meleeweapons = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.meleeweapons"));
        _data.attacks.dextimesfive = _data.statistics["dexterity"].x5;
        _data.attacks.athletics = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.athletics"));
        _data.attacks.firearms = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.firearms"));
        _data.attacks.heavyweapons = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.heavyweapons"));
        _data.attacks.demolitions = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.demolitions"));
        _data.attacks.artillery = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.artillery"));

        
        
        let strength = _data.statistics.strength.value;
        let db = "";

        if(strength < 5){            
            db = "-2";
          }
          else if(strength < 9){           
            db = "-1";
          }
          else if(strength > 12 && strength < 17){           
            db = "+1";
          }
          else if(strength > 16){            
            db = "+2";
          } 

          _data.statistics.strength.bonus = db;

    }

    prepareDerivedData() {

        super.prepareDerivedData();

        const actorData = this.data;
        const _data = actorData.data;
        const _flags = actorData.flags;


    }

    _setBreakPoint() {
        let newbreak = this.system.sanity.value - this.system.statistics.power.value;

        this.update({ ["data.sanity.currentbreakingpoint"]: newbreak })
        //this.system.sanity.currentbreakingpoint=newbreak;       
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
                return item.name == skillname

            });
        if (skillitem)
            return skillitem.system.value;
        return null;
    }

    getSkillByName(skillname) {
        let skillitem = this.data.items.find(
            item => {
                return item.name == skillname

            });
        if (skillitem)
            return skillitem;
        return null;
    }

    getStatx5ValueByName(statname) {
        let result = -1;

        if (this.data && this.system.statistics[statname].x5)

            result = Number(this.system.statistics[statname].x5);

        return result;

    }

    getDamageBonus()
    {
        return this.system.statistics.strength.bonus;
    }





}