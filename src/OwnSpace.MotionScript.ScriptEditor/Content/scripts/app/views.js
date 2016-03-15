define(["marionette", "underscore", "templates", "models", "jquery"], function(Marionette, _, templates, Models) {
    var HeaderView = Marionette.ItemView.extend({
            template: _.template(templates.header),
            events: {
                "change #action-command": "changeBlock" // ToDo: use buttons set instead select for more convenient usage
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }
            },
            changeBlock: function(e) {
                var activeBlock = this.model.getActiveBlock();
                if (activeBlock) {
                    activeBlock.set({ type: e.target.value.toLowerCase() });
                }
            }
        }),
        NavView = Marionette.ItemView.extend({
            template: _.template(templates.nav),
            events: {
                "click .scenenav-list-link": "navigate"
            },
            initialize: function(options) {
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
            events: {
                "click p.block": "setActive"
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }

                this.model.on("change:type", this.render, this);
            },
            setActive: function(e) {
                this.vent.trigger("scenario:resetActive");
                this.model.set({ active: true });
            }
        }),
        SceneView = Marionette.CompositeView.extend({
            template: _.template(templates.scene),
            tagName: "scene",
            childView: BlockView,
            childViewOptions: function(model, index) {
                return {
                    vent: this.options.vent
                }
            },
            events: {
                "click .add": "addBlock",
                "click .delete": "deleteScene"
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }

                this.collection = this.model.get("blocks");
            },
            getNextType: function() {
                // ToDo: use flow algorithm
                return "action";
            },
            addBlock: function(e) {
                e.preventDefault();

                var data = {
                    type: this.getNextType()
                };

                this.collection.add(new Models.ScriptBlock(data));
            },
            deleteScene: function() {
                this.model.destroy();
                this.collection.clear();
                this.remove();
            }
        }),
        ScenarioView = Marionette.CompositeView.extend({
            template: _.template(templates.scenario),
            tagName: "scenario",
            childView: SceneView,
            childViewOptions: function(model, index) {
                return {
                    vent: this.options.vent
                }
            },
            events: {
                "click #add": "addScene"
            },
            addScene: function(e) {
                e.preventDefault();

                var data = {};

                this.collection.add(new Models.Scene(data));
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                        this.vent.on("scenario:resetActive", this.resetActive, this);
                    }
                }

                this.listenTo(this.collection, "add", this.renderScene);
                this.listenTo(this.collection, "reset", this.render);
            },
            resetActive: function() {
                var activeBlock = this.model.getActiveBlock();
                if (activeBlock) {
                    activeBlock.set({ active: false });
                }
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
                        model: this.model,
                        vent: this.vent
                    }));
                this.getRegion("workplace").show(
                    new ScenarioView({
                        model: this.model,
                        collection: this.model.get("scenes"),
                        vent: this.vent
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
