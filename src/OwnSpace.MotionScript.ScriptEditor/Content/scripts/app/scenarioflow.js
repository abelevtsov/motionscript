define(function() {
    var text = {
            sceneheading: {
                next: "action",
                inPlace: false
            },
            action: {
                next: "action",
                inPlace: false
            },
            character: {
                next: "dialog",
                inPlace: false
            },
            dialog: {
                next: "character",
                inPlace: false
            },
            parenthetical: {
                next: "dialog",
                inPlace: false
            },
            transition: {
                next: "sceneheading",
                inPlace: false
            },
            shot: {
                next: "action",
                inPlace: false
            },
            text: {
                next: "text",
                inPlace: false
            }
        },
        empty = {
            sceneheading: {
                next: "sceneheading",
                inPlace: true
            },
            action: {
                next: "sceneheading",
                inPlace: true
            },
            character: {
                next: "action",
                inPlace: true
            },
            dialog: {
                next: "action",
                inPlace: true
            },
            parenthetical: {
                next: "dialog",
                inPlace: true
            },
            transition: {
                next: "sceneheading",
                inPlace: true
            },
            shot: {
                next: "action",
                inPlace: true
            },
            text: {
                next: "text",
                inPlace: true
            }
        };

    return {
        empty: empty,
        text: text
    };
});
