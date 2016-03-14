define(["text!../app/templates/header.html",
        "text!../app/templates/sidebar.html",
        "text!../app/templates/nav.html",
        "text!../app/templates/title.html",
        "text!../app/templates/block.html",
        "text!../app/templates/scene.html",
        "text!../app/templates/scenario.html",
        "text!../app/templates/main.html",
        "text!../app/templates/layout.html"
    ], function(header, sidebar, nav, title, block, scene, scenario, main, layout) {
    "use strict";

    return {
        header: header,
        sidebar: sidebar,
        nav: nav,
        title: title,
        block: block,
        scene: scene,
        scenario: scenario,
        main: main,
        applayout: layout
    }
});
