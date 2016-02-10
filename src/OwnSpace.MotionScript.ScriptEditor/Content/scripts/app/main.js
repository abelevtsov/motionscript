define(["backbone", "marionette"], function(Backbone, Marionette) {
    var loadInitialData = function() {
            return {
                then: function(callback) {
                    callback && callback();
                }
            };
        },
        app = Marionette.Application.extend({
            initialize: function(options) {
                console.log("app init");
            }
        });

    app = new app({ container: "#app" });
    app.addInitializer(function(options) {
        if (Backbone.history) {
            Backbone.history.start();
        }
    });

    loadInitialData().then(app.start);
});

