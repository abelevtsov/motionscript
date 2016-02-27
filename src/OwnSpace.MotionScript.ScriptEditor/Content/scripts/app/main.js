define(["backbone", "marionette", "views", "models"], function(Backbone, Marionette, Views, Models) {
    var loadInitialData = function() {
            return {
                then: function (callback) {
                    callback && callback();
                }
            };
        },
        App = Marionette.Application.extend({
            initialize: function(options) {
                console.log("app init");
                if (Backbone.history) {
                    Backbone.history.start();
                }

                //this.rootView = new Views.RootView();
            }
        });

    var app = new App(),
        author = new Models.Author({}),
        scenario = new Models.Scenario({
            author: author
        });

    app.addInitializer(function(options) {
        var appHeaderView = new Views.HeaderView({
                vent: this.vent,
                model: scenario
            }),
            appSidebarView = new Views.SidebarView({
                vent: this.vent
            }),
            appMainView = new Views.MainView({
                vent: this.vent
            }),

            layout = new AppLayout();

        app.appRegion.show(layout);

        layout.headerRegion.show(appHeaderView);
        layout.sidebarRegion.show(appSidebarView);
        //layout.mainRegion.show(appMainView);
        this.vent.on("sidebar:toggle", function(e) {
            if (layout.sidebarRegion.currentView) {
                layout.sidebarRegion.empty();
            } else {
                if (appSidebarView.isDestroyed) {
                    appSidebarView = new Views.SidebarView({
                        vent: this.vent
                    });
                }

                layout.sidebarRegion.show(appSidebarView);
            }
        });
    });
    var AppLayout = Backbone.Marionette.LayoutView.extend({
        template: "#app-layout-template",
        regions: {
            mainRegion: "#main",
            headerRegion: "#header",
            sidebarRegion: "#sidebar"
        }
    });

    app.addRegions({
        appRegion: "#page"
    });

    app.on("start", function() {
        //var block = new Models.ScriptBlock({ text: "WTF" });
        //this.rootView.getRegion("sidebar").show(new Views.SidebarView({ model: "" }));
        //this.rootView.getRegion("main").show(new Views.MainView({ model: block }));
    });
    
    //loadInitialData().then(app.start);
    app.start();
});

