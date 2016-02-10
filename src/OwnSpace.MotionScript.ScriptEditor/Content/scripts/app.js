(function() {
    require.config({
        baseUrl: "../content/scripts/lib",
        paths: {
            app: "../app",
            backbone: "backbone/backbone",
            "backbone.babysitter": "backbone.babysitter/backbone.babysitter",
            "backbone.wreqr": "backbone.wreqr/backbone.wreqr",
            marionette: "marionette/backbone.marionette",
            underscore: "underscore/underscore",
            jquery: "jquery/jquery",
            text: "requirejs-text/text"
        },
        shim: {
            backbone: {
                exports: "Backbone"
            },
            marionette: {
                exports: "Marionette"
            },
            underscore: {
                exports: "_"
            },
            jquery: {
                exports: "$"
            }
        }
    });

    require(["app/main"]);
})();
