define(["backbone", "marionette", "views", "models", "templates", "underscore", "blocktypes", "jquery", "jquery-ui"], function(Backbone, Marionette, Views, Models, templates, _, blocktypes, $) {
    var scenario,
        app,
        loadInitialData = function() {
            var currentId = $("#currentId").text();
            if (!currentId) {
                var author = new Models.Author({}),
                    scene = new Models.Scene({
                        blocks: new Models.ScriptBlocks([
                            new Models.ScriptBlock({
                                text: "SCENE 1",
                                blockType: "sceneheading"
                            })
                        ])
                    });
                scenario =
                    new Models.Scenario({
                        author: author,
                        scenes: new Models.Scenes([scene])
                    });
                app.start();
            } else {
                $.get("/scenario/" + currentId).done(function(data) {
                    scenario =
                        new Models.Scenario({
                            id: data.id,
                            name: data.name,
                            version: data.version,
                            author: new Models.Author(data.author),
                            scenes: new Models.Scenes(_.map(data.scenes, function(s) {
                                var blocks = _.map(s.blocks, function (b) {
                                        console.log(blocktypes[b.blockType]);
                                        return new Models.ScriptBlock({
                                            text: b.text,
                                            blockType: blocktypes[b.blockType]
                                        });
                                    });

                                return new Models.Scene({
                                    heading: s.heading,
                                    blocks: new Models.ScriptBlocks(blocks)
                                });
                            }))
                        });
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    alert("An error occured: " + textStatus);
                }).always(function() {
                    app.start();
                });
            }
        },
        App = Marionette.Application.extend({
            initialize: function(options) {
                console.log("app init");
                if (Backbone.history) {
                    Backbone.history.start();
                }
            }
        });

    app = new App();

    app.addInitializer(function(opts) {
        var ribbonView = new Views.RibbonView({
                vent: this.vent
            }),
            appHeaderView = new Views.HeaderView({
                vent: this.vent,
                model: scenario
            }),
            sidebarView = new Views.SidebarView({
                vent: this.vent,
                collection: scenario.get("scenes")
            }),
            appMainView = new Views.MainView({
                vent: this.vent,
                model: scenario
            }),
            layout = new Views.AppLayout();

        app.appRegion.show(layout);

        layout.ribbonRegion.show(ribbonView);
        layout.headerRegion.show(appHeaderView);
        layout.sidebarRegion.show(sidebarView);
        layout.mainRegion.show(appMainView);

        this.vent.on("sidebar:toggle", function(e) {
            if (layout.sidebarRegion.currentView) {
                layout.sidebarRegion.empty();
            } else {
                if (sidebarView.isDestroyed) {
                    sidebarView = new Views.SidebarView({
                        vent: this.vent,
                        collection: scenario.get("scenes")
                    });
                }

                layout.sidebarRegion.show(sidebarView);
            }

            var effect = "slide",
                options = { direction: "left" },
                duration = 500;

            $("#sidebar").toggle(effect, options, duration);
        });
    });

    app.addRegions({
        appRegion: "#app"
    });

    loadInitialData();
});
