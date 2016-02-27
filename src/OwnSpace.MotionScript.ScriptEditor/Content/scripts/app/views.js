define(["backbone", "marionette", "models", "text!app/templates.html"], function(Backbone, Marionette, Models, templates) {
    var HeaderView = Marionette.ItemView.extend({
            template: "#header-template",
            events: {
                "click #toggle-sidebar-command": "toggleSidebar"
            },
            initialize: function (options) {
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
            template: "#sidebar-template",
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
        BlockView = Marionette.ItemView.extend({
            template: "#block-template"
        }),
        BlocksView = Marionette.CollectionView.extend({
            itemView: BlockView
        }),
        MainView = Marionette.LayoutView.extend({
            template: "#main-template",
            regions: {
                title: "#title",
                workplace: "#workplace"
            },
            onBeforeShow: function () {
                this.getRegion("title").show(new TitleView());
                this.getRegion("workplace").show(new BlocksView());
            }
        }),
        RootView = Marionette.LayoutView.extend({
            el: "#app",
            regions: {
                sidebar: "#sidebar",
                main: "#main"
            },
            initialize: function() {
                //Backbone.Radio.channel("root").comply("set:main", function(mainView) {
                //    this.getRegion("main").show(mainView);
                //});
            },
            onBeforeShow: function() {
                alert("RootView.onBeforeShow");
                var block = new Models.ScriptBlock({ text: "WTF" });
                this.getRegion("sidebar").show(new SidebarView({ model: "" }));
                this.getRegion("main").show(new MainView({ model: block }));
            }
        });

    return {
        RootView: RootView,
        HeaderView: HeaderView,
        SidebarView: SidebarView,
        MainView: MainView,
        BlockView: BlockView,
        BlocksView: BlocksView
    }
});
