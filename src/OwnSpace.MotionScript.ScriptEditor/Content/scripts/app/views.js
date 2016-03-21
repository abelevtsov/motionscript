define(["marionette", "underscore", "templates", "models", "jquery", "scenarioflow"], function (Marionette, _, templates, Models, $, scenarioflow) {
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
                "focusin p.block": "setActive"
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
                if (this.model.get("active")) {
                    return;
                }

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
                "click .delete": "deleteScene",
                "keypress p.block": "addNew",
                "keyup p.block": "processBlock"
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }

                this.collection = this.model.get("blocks");
                this.listenTo(this.collection, "add", this.renderBlock);
                this.listenTo(this.collection, "reset", this.render);
            },
            renderBlock: function() {
                console.log("SceneView:renderBlock");
            },
            getNextType: function(haveText, type) {
                var flow = haveText ? scenarioflow.text : scenarioflow.empty;

                return flow[type];
            },
            addNew: function(e) {
                var enterKey = 13,
                    activeBlock = this.collection.findWhere("active"),
                    activeBlockIndex = this.collection.indexOf(activeBlock),
                    $current = $(e.target);

                if (e.which === enterKey) {
                    e.preventDefault();
                    var haveText = !!$current.text(),
                        nextType = this.getNextType(haveText, activeBlock.get("type")),
                        data = {
                            type: nextType.next
                        };

                    var model = new Models.ScriptBlock(data);
                    if (nextType.inPlace) {
                        this.collection.remove(this.collection.at(activeBlockIndex));

                        this.collection.add(model, { at: activeBlockIndex });
                    } else {
                        this.collection.add(model, { at: activeBlockIndex + 1 });
                        $current.parent().next().find("p.block").focus();
                    }
                }
            },
            processBlock: function(e) {
                var backspaceKey = 8,
                    activeBlock = this.collection.findWhere("active"),
                    activeBlockIndex = this.collection.indexOf(activeBlock),
                    $current = $(e.target);

                if (e.which === backspaceKey) {
                    if ($current.text()) {
                        return;
                    }

                    var $prev = $current.parent().prev().find("p.block");

                    this.collection.remove(activeBlock);
                    this.collection.at(activeBlockIndex - 1).set({ active: true });
                    $prev.focus();
                } else {
                    activeBlock.set({ text: $current.text() });
                }
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
                console.log("renderScene" + scene.toJSON());
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
