export default class DgActor extends Actor {
    prepareData() {
        super.prepareData();

        
        
        for (let [key, statistic] of Object.entries(this.system.statistics)) {

            let statfield = "statistics." + key + ".x5";
            let statx5 = statistic.value * 5;

            

            this.system.statistics[key].x5 = statx5;
            
        }

        let maxhp = Math.ceil((Number(this.system.statistics.constitution.value) + Number(this.system.statistics.strength.value)) / 2);
        let pow = Number(this.system.statistics.power.value);
        
        
        this.system.health.max = maxhp;
        this.system.wp.max = pow;

        let unnatural = this.items.find(function (item) {
            return (item.type == "Skill" && item.name == "Unnatural")
        })

        if (unnatural && unnatural.system.value)
           
            this.system.sanity.max = 99 - unnatural.system.value;
        else
           
            this.system.sanity.max = 99;

        if (this.system.sanity.value > this.system.sanity.max) 
            this.system.sanity.value = this.system.sanity.max;

      

        this.system.attacks.none = 0;
        this.system.attacks.unarmedcombat = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.unarmedcombat"));
        this.system.attacks.meleeweapons = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.meleeweapons"));
        this.system.attacks.dextimesfive = this.system.statistics["dexterity"].x5;
        this.system.attacks.athletics = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.athletics"));
        this.system.attacks.firearms = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.firearms"));
        this.system.attacks.heavyweapons = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.heavyweapons"));
        this.system.attacks.demolitions = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.demolitions"));
        this.system.attacks.artillery = this.getSkillValueByName(game.i18n.localize("dgalt.attackskills.artillery"));

        
        
        let strength = this.system.statistics.strength.value;
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

          this.system.statistics.strength.bonus = db;

    }

    prepareDerivedData() {

        super.prepareDerivedData();

       

    }

    _setBreakPoint() {
        let newbreak = this.system.sanity.value - this.system.statistics.power.value;

        this.update({ ["sanity.currentbreakingpoint"]: newbreak })
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
        let skillitem = this.items.find(
            item => {
                return item.name == skillname

            });
        if (skillitem)
            return skillitem.system.value;
        return null;
    }

    getSkillByName(skillname) {
        let skillitem = this.items.find(
            item => {
                return item.name == skillname

            });
        if (skillitem)
            return skillitem;
        return null;
    }

    getStatx5ValueByName(statname) {
        let result = -1;

        if (this.system.statistics[statname].x5)

            result = Number(this.system.statistics[statname].x5);

        return result;

    }

    getDamageBonus()
    {
        return this.system.statistics.strength.bonus;
    }





}