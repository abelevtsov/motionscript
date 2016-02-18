define(["backbone", "marionette", "radio"], function(Backbone, Marionette, Radio) {
    var loadInitialData = function() {
            return {
                then: function(callback) {
                    callback && callback();
                }
            };
        },
        App = Marionette.Application.extend({
            initialize: function(options) {
                console.log("app init");
            }
        }),
        RootView = Marionette.LayoutView.extend({
            el: "body",
            regions: {
                sidebar: "sidebar",
                main: "main",
                footer: "footer"
            },
            initialize: function() {
                Radio.channel('root').comply('set:main', function(mainView) {
                    this.getRegion('main').show(mainView);
                });
            },
            onBeforeShow: function() {
                this.getRegion('sidebar').show(new SideView());
                this.getRegion('footer').show(new FooterView());
                this.getRegion('main').show(new MainView());
            }
        }),
        MainView = Marionette.LayoutView.extend({
            template: "#mainViewTemplate",
            regions: {
                title: "title",
                workplace: "workplace"
            },
            onBeforeShow: function () {
                this.getRegion("title").show(new TitleView());
                this.getRegion("workplace").show(new BlocksView());
            }
        }),
        BlockView = Marionette.ItemView.extend({
            template: "#blockTemplate"
        }),
        BlocksView = Marionette.CollectionView.extend({
            itemView: BlockView
        });

    var app = new App({ container: "#app" });
    app.addInitializer(function(options) {
        if (Backbone.history) {
            Backbone.history.start();
        }

        app.rootView = new RootView();
        app.rootView.getRegion("main").show(new MainView());
    });

    loadInitialData().then(app.start);
});
