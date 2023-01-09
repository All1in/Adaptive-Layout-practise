const { series, parallel, watch, src, dest } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));

const serv = () => {
    browserSync.init({
        server: {
            baseDir: "./",
        },
    });
};

const bsReload = (cb) => {
    browserSync.reload();
    cb();
};

const styles = () => {
    return src("./src/scss/style.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("./dist/styles/"))
        .pipe(browserSync.stream());
};
const js = () => {
    return src("./src/js/index.js")
        .pipe(dest("./dist/js/"))
        .pipe(browserSync.stream());
};

const watcher = (cb) => {
    watch("./index.html", bsReload);
    watch("./src/scss/*.scss", styles);
    watch("./src/js/index.js", js);
    cb();
};

exports.default = parallel(serv, watcher, series(styles, js));
