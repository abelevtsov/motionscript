define(["marionette", "underscore", "templates", "models"], function(Marionette, _, templates, Models) {
    var HeaderView = Marionette.ItemView.extend({
            template: _.template(templates.header),
            events: {
                "click #toggle-sidebar-command": "toggleSidebar"
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }
            },
            toggleSidebar: function(e) {
                if (this.vent) {
                    this.vent.trigger("sidebar:toggle");
                }
            }
        }),
        SidebarView = Marionette.ItemView.extend({
            template: _.template(templates.sidebar),
            events: {
                "click #alert-command": "makeAlert"
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }
            },
            makeAlert: function(e) {
                alert("I'm a sidebar!");
            }
        }),
        TitleView = Marionette.ItemView.extend({
            template: _.template(templates.title),
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }
            }
        }),
        BlockView = Marionette.ItemView.extend({
            template: _.template(templates.block),
            tagName: "block",
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }
            }
        }),
        SceneView = Marionette.CompositeView.extend({
            template: _.template(templates.scene),
            tagName: "scene",
            childView: BlockView,
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }

                this.collection = this.model.get("blocks");
            }
        }),
        ScenarioView = Marionette.CompositeView.extend({
            template: _.template(templates.scenario),
            tagName: "scenario",
            childView: SceneView,
            events: {
                "click #add": "addScene"
            },
            addScene: function(e) {
                e.preventDefault();

                var formData = {};

                this.collection.add(new Models.Scene(formData));
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }

                this.collection.fetch({ reset: true });

                this.listenTo(this.collection, "add", this.renderScene);
                this.listenTo(this.collection, "reset", this.render);
            },
            renderScene: function(scene) {
                console.log(scene);
            }
        }),
        MainView = Marionette.LayoutView.extend({
            template: _.template(templates.main),
            regions: {
                title: "#title",
                workplace: "#workplace"
            },
            onBeforeShow: function() {
                this.getRegion("title").show(
                    new TitleView({
                        model: this.model
                    }));
                this.getRegion("workplace").show(
                    new ScenarioView({
                        model: this.model,
                        collection: this.model.get("scenes")
                    }));
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }
            }
        }),
        AppLayout = Marionette.LayoutView.extend({
            template: _.template(templates.applayout),
            regions: {
                mainRegion: "#main",
                headerRegion: "#header",
                sidebarRegion: "#sidebar"
            }
        });

    return {
        HeaderView: HeaderView,
        SidebarView: SidebarView,
        MainView: MainView,
        AppLayout: AppLayout
    }
});
