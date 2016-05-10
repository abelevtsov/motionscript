(function() {
    require.config({
        baseUrl: "../content/scripts/lib",
        paths: {
            app: "../app",
            templates: "../app/templates/templates",
            views: "../app/views",
            models: "../app/models",
            scenarioflow: "../app/scenarioflow",
            blocktypes: "../app/blocktypes",
            backbone: "backbone/backbone",
            "backbone.babysitter": "backbone.babysitter/backbone.babysitter",
            "backbone.wreqr": "backbone.wreqr/backbone.wreqr",
            radio: "backbone.radio/backbone.radio",
            marionette: "marionette/backbone.marionette",
            underscore: "underscore/underscore",
            jquery: "jquery/jquery",
            "jquery-ui": "jquery-ui/jquery-ui",
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
