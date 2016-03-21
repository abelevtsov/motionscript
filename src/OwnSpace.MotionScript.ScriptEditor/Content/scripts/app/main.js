define(["backbone", "marionette", "views", "models", "templates", "jquery", "jquery-ui"], function(Backbone, Marionette, Views, Models, templates, $) {
    var loadInitialData = function() {
            $.get("/scenario/1").done(function(data) {
                scenario = data;
            }).fail(function(jqXHR, textStatus, errorThrown) {
                alert("An error occured: " + textStatus);
            }).always(function() {
                app.start();
            });
        },
        App = Marionette.Application.extend({
            initialize: function(options) {
                console.log("app init");
                if (Backbone.history) {
                    Backbone.history.start();
                }
            }
        }),

        app = new App(),
        author = new Models.Author({}),
        scene = new Models.Scene({
            blocks: new Models.ScriptBlocks([
                new Models.ScriptBlock({
                    text: "SCENE 1",
                    type: "sceneheading"
                }), new Models.ScriptBlock({
                     text: "Charlie tear down slowly"
                })])
        }),
        scenario = new Models.Scenario({
            author: author,
            scenes: new Models.Scenes([scene])
        });

    app.addInitializer(function(options) {
        var appHeaderView = new Views.HeaderView({
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

