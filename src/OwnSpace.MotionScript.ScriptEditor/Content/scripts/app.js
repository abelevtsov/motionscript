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
                deps: ["underscore", "jquery"],
                exports: "Backbone"
            },
            marionette: {
                deps: ["jquery", "underscore", "backbone"],
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
