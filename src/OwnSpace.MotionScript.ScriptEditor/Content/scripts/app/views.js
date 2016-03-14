define(["marionette", "underscore", "templates", "models", "jquery"], function(Marionette, _, templates, Models) {
    var HeaderView = Marionette.ItemView.extend({
            template: _.template(templates.header),
            events: {
                "change #action-command": "doAction"
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }
            },
            doAction: function(e) {
                if (this.vent) {
                    this.vent.trigger("scenario:changeBlock", e);
                }
            }
        }),
        NavView = Marionette.ItemView.extend({
            template: _.template(templates.nav),
            events: {
                "click .scenenav-list-link": "navigate"
            },
            initialize: function (options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }
            },
            navigate: function (e) {
                if (this.vent) {
                    this.vent.trigger("sidebar:navigate");
                }
            }
        }),
        SidebarView = Marionette.CompositeView.extend({
            template: _.template(templates.sidebar),
            childView: NavView,
            sort: false,
            events: {
                "click #toggle": "toggle"
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }
            },
            toggle: function(e) {
                if (this.vent) {
                    this.vent.trigger("sidebar:toggle");
                }
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
            },
            onRender: function() {
                this.$el = this.$el.children();
                this.$el.unwrap();
                this.setElement(this.$el);
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
                headerRegion: "#header",
                sidebarRegion: "#sidebar",
                mainRegion: "#main"
            }
        });

    return {
        HeaderView: HeaderView,
        SidebarView: SidebarView,
        MainView: MainView,
        AppLayout: AppLayout
    }
});
