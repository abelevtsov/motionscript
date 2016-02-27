define(["backbone"], function(Backbone) {
    var Scenario = Backbone.Model.extend({
            defaults: {
                name: "My first scenario",
                version: "0.0.0.1"
            }
        }),
        Author = Backbone.Model.extend({
            defaults: {
                firstName: "Genrikh",
                lastName: "Ptashkin",
                middleName: "Erickovitch"
            },
            fullName: function() {
                return this.get("firstName") + " " + this.get("middleName") + " " + this.get("lastName");
            }
        }),
        ScriptBlock = Backbone.Model.extend({
            defaults: {
                text: "",
                type: "Text"
            }
        });

    return {
        ScriptBlock: ScriptBlock,
        Author: Author,
        Scenario: Scenario
    }
})
