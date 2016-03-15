define(["backbone"], function(Backbone) {
    var ScriptBlock = Backbone.Model.extend({
            defaults: {
                text: "",
                type: "action",
                active: false
            }
        }),
        ScriptBlockCollection = Backbone.Collection.extend({
            model: ScriptBlock
        }),
        Scene = Backbone.Model.extend({
            defaults: {
                heading: "",
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
            },
            getActiveBlock: function() {
                var scenes = this.get("scenes");
                for (var i = scenes.length; i--;) {
                    var blocks = scenes.models[i].get("blocks");
                    for (var j = blocks.length; j--;) {
                        var block = blocks.models[j],
                            active = block.get("active");

                        if (active) {
                            return block;
                        }
                    }
                }

                return null;
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
