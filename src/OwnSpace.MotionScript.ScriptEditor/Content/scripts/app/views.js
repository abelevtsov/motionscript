define(["marionette", "underscore", "templates", "models", "jquery", "scenarioflow"], function (Marionette, _, templates, Models, $, scenarioflow) {
    var createCaretPlacer = function(atStart) {
            if (window.getSelection && document.createRange) {
                return function(el) {
                    el.focus();
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    range.collapse(atStart);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                };
            } else if (document.body.createTextRange) {
                return function(el) {
                    el.focus();
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.collapse(atStart);
                    textRange.select();
                };
            }

            return function() {

            };
        },
        placeCaretAtEnd = createCaretPlacer(false),
        HeaderView = Marionette.ItemView.extend({
            template: _.template(templates.header),
            events: {
                "change #action-command": "changeBlock" // ToDo: use separate buttons instead select for more convenient usage
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                        this.vent.on("header:setAction", this.setCurrentAction, this);
                    }
                }
            },
            setCurrentAction: function(value) {
                $("#action-command").val(value);
            },
            changeBlock: function(e) {
                var activeBlock = this.model.getActiveBlock();
                if (activeBlock) {
                    activeBlock.set({ type: e.target.value });
                    var $activeView = $("p.block[active='true']");
                    $activeView.focus();
                    placeCaretAtEnd($activeView[0]);
                }
            }
        }),
        NavView = Marionette.ItemView.extend({
            template: _.template(templates.nav),
            tagName: "ul",
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
                "click #toggle": "toggle",
                "click .scenenav-list-link": "navigate"
            },
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                    }
                }
            },
            navigate: function(e) {
                this.collection.at(0).get("blocks").at(0).set({ active: true });
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
                "click .clear": "clearBlock", // ToDo: add "X" button to the right of block for this purposes
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
                var model = this.model;
                if (model.get("active")) {
                    return;
                }

                this.vent.trigger("scenario:resetActive");
                model.set({ active: true });
                this.vent.trigger("header:setAction", model.get("type"));
            },
            clearBlock: function(e) {
                $(e.target).closest("p.block").text("").focus();
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
                "keypress p.block": "addNewBlock",
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
                console.log("SceneView: renderBlock");
            },
            getNextType: function(haveText, type) {
                var flow = haveText ? scenarioflow.text : scenarioflow.empty;

                return flow[type];
            },
            addNewBlock: function(e) {
                var enterKey = 13,
                    collection = this.collection,
                    activeBlock = collection.findWhere("active"),
                    activeBlockIndex = collection.indexOf(activeBlock),
                    $activeView,
                    $current = $(e.target),
                    $block = $current.parent(),
                    $prev = $block.prev();

                if (e.which === enterKey) {
                    e.preventDefault();
                    var haveText = !!$current.text(),
                        nextType = this.getNextType(haveText, activeBlock.get("type")),
                        data = {
                            type: nextType.next
                        };

                    // ToDo: refact this shit
                    if (data.type === "sceneheading") {
                        var blocksToMove = collection.slice(activeBlockIndex + 1, collection.length);
                        if (nextType.inPlace) {
                            collection.remove(collection.at(activeBlockIndex));
                            $current = $prev;
                        } else {
                            $current = $block;
                        }

                        collection.remove(blocksToMove);
                        this.vent.trigger("scenario:addScene", data, this.model, blocksToMove);
                        $activeView = $current.closest("scene").next().find("p.block.sceneheading");
                        $activeView.focus();
                        placeCaretAtEnd($activeView[0]);
                        return;
                    }

                    var model = new Models.ScriptBlock(data);
                    if (nextType.inPlace) {
                        collection.remove(collection.at(activeBlockIndex));

                        collection.add(model, { at: activeBlockIndex });
                        this.vent.trigger("header:setAction", model.get("type"));
                        $current = $prev;
                    } else {
                        collection.add(model, { at: activeBlockIndex + 1 });
                        $current = $block;
                    }

                    $activeView = $current.next().find("p.block");
                    $activeView.focus();
                    placeCaretAtEnd($activeView[0]);
                }
            },
            processBlock: function(e) {
                var backspaceKey = 8,
                    removeKey = "readyForRemove",
                    collection = this.collection,
                    activeBlock = collection.findWhere("active"),
                    activeBlockIndex = collection.indexOf(activeBlock),
                    $current = $(e.target);

                if (e.which === backspaceKey) {
                    if ($current.text()) {
                        $current.data(removeKey, false);
                        return;
                    }

                    if (!$current.data(removeKey)) {
                        $current.data(removeKey, true);
                        return;
                    }

                    var type = activeBlock.get("type"),
                        $prev = type === "sceneheading" ? $current.closest("scene").prev().find("p.block").last() : $current.parent().prev().find("p.block");

                    collection.remove(activeBlock);
                    if (type === "sceneheading") { // ToDo: use !collection.length and move blocks to prev scene otherwise
                        this.deleteScene();
                        $prev.focus();
                        if ($prev.length && $prev.text()) {
                            placeCaretAtEnd($prev[0]);
                        }

                        return;
                    }

                    activeBlock = collection.at(activeBlockIndex - 1);
                    activeBlock && activeBlock.set({ active: true });
                    $prev.focus();
                    if ($prev.length) {
                        placeCaretAtEnd($prev[0]);
                    }

                    activeBlock && this.vent.trigger("header:setAction", activeBlock.get("type"));
                } else {
                    $current.data(removeKey, false);
                    activeBlock.set({ text: $current.text() });
                }
            },
            deleteScene: function() {
                this.model.destroy();
                this.collection.reset();
                this.remove();
                this.vent.trigger("scenario:removeScene", this.model);
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
            initialize: function(options) {
                if (options) {
                    if (options.vent) {
                        this.vent = options.vent;
                        this.vent.on("scenario:resetActive", this.resetActive, this);
                        this.vent.on("scenario:addScene", this.addScene, this);
                        this.vent.on("scenario:removeScene", this.removeScene, this);
                    }
                }

                this.listenTo(this.collection, "add", this.renderScene);
                this.listenTo(this.collection, "reset", this.render);
            },
            addScene: function(data, currentScene, blocksToMove) {
                var collection = this.collection,
                    headingBlock = new Models.ScriptBlock({ type: data.type, text: "SCENE " + ++collection.length }),
                    currentSceneIndex = collection.indexOf(currentScene);

                blocksToMove.unshift(headingBlock);
                var scene = new Models.Scene({
                        blocks: new Models.ScriptBlocks(blocksToMove)
                    });

                collection.add(scene, { at: currentSceneIndex + 1 });
            },
            removeScene: function(scene) {
                this.collection.remove(scene);
            },
            resetActive: function() {
                var activeBlock = this.model.getActiveBlock();
                if (activeBlock) {
                    activeBlock.set({ active: false });
                    var $activeView = $("p.block[active='true']");
                    $activeView.attr("active", false);
                }
            },
            renderScene: function(scene) {
                console.log("renderScene: " + scene.toJSON());
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
