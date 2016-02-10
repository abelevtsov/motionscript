var gulp = require("gulp"),
    bower = require("gulp-bower"),
    jscs = require("gulp-jscs"),
    jsHint = require("gulp-jshint"),
    growl = require("gulp-notify-growl"),
    jsHintStylish = require("jshint-stylish"),
    runSequence = require("run-sequence"),
    console = require("better-console"),
    flatten = require("gulp-flatten"),

    handleJscsError = function(err) {
        console.log("Error: " + err.toString());
        this.emit("end");
    };

gulp.task("default", ["watch"]);

gulp.task("bower", function() {
    return bower("./bower_components");
});

gulp.task("copy-index-html", function() {
    gulp.src("./bower_components/**/*.js", { read: false })
        .pipe(flatten())
         // Perform minification tasks, etc here
        .pipe(gulp.dest("./content/scripts/lib"));
});

gulp.task("jscs", function() {
    return gulp.src([
        "scripts/**/*.js",
        "!scripts/lib/**/*.js"
    ]).pipe(jscs())
      .on("error", handleJscsError);
});

gulp.task("lint", function() {
    return gulp.src([
        "scripts/**/*.js",
        "!scripts/lib/**/*.js"
    ]).pipe(jsHint())
      .pipe(jsHint.reporter(jsHintStylish));
});

gulp.task("watch", function() {
    console.clear();

    return gulp.watch([
            "scripts/**/*.js",
            "!scripts/lib/**/*.js"
        ],
        function() {
            console.clear();

            runSequence("bower", "jscs", "lint", function() {
               console.log("Tasks Completed.");
            });
    });
});
