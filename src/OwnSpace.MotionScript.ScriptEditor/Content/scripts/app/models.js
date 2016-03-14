define(["backbone"], function(Backbone) {
    var ScriptBlock = Backbone.Model.extend({
            defaults: {
                text: "",
                type: "action"
            }
        }),
        ScriptBlockCollection = Backbone.Collection.extend({
            model: ScriptBlock
        }),
        Scene = Backbone.Model.extend({
            defaults: {
                heading: "SCENE 1",
                blocks: new ScriptBlockCollection()
            }
        }),
        SceneCollection = Backbone.Collection.extend({
            model: Scene
        }),
        Author = Backbone.Model.extend({
            defaults: {
                firstName: "Genrikh",
                lastName: "Ptashkin",
                middleName: "Erickovitch"
            },
            fullName: function() {
                if (!this.fullName.compiled) {
                    this.fullName.compiled = _.template("<%= firstName %> <%= middleName %> <%= lastName %>");
                }

                return this.fullName.compiled(this.toJSON());
            }
        }),
        Scenario = Backbone.Model.extend({
            defaults: {
                name: "My first scenario",
                version: "0.0.0.1",
                scenes: new SceneCollection()
            }
        });

    return {
        ScriptBlock: ScriptBlock,
        Author: Author,
        Scene: Scene,
        Scenes: SceneCollection,
        ScriptBlocks: ScriptBlockCollection,
        Scenario: Scenario
    };
})
