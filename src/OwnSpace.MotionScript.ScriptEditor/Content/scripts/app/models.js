﻿define(["backbone", "underscore"], function(Backbone, _) {
    var ScriptBlock = Backbone.Model.extend({
            defaults: {
                text: "",
                blockType: "action",
                active: false
            },
            initialize: function() {
                // if (this.isNew()) {
                //     this.set("active", true);
                // }
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
                version: "1",
                scenes: new SceneCollection()
            },
            url: function(id) {
                return id ? "/scenario/" + id : "/scenario";
            },
            getActiveBlock: function() {
                var scenes = this.get("scenes");
                // ToDo: improve search - hold active block index in dedicated place
                for (var i = scenes.length; i--;) {
                    var blocks = scenes.models[i].get("blocks");
                    for (var j = blocks.length; j--;) {
                        var block = blocks.models[j];
                        if (block.get("active")) {
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
