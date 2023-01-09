
const { series, watch, src, dest, task, parallel } = require("gulp");

const browserSync = require('browser-sync').create();
const sass = require("gulp-sass")(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require('gulp-clean-css');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const purgecss = require('gulp-purgecss');

const cleanDist = () =>  {
    return src('dist/*')
        .pipe(clean());
};

const compileCSS = () => {
    return src('src/scss/*.scss')
        .pipe(sass())
        .pipe(dest('src/css/'))
};

const addPrefix = () => {
    return src('src/css/*.css')
        .pipe(autoprefixer({
            overrideBrowserList: ['last 2 versions'],
            cascade: false
        }))
        .pipe(dest('src/css/'))
};

const garbageCss = () => {
    return src('src/css/*.css')
    .pipe(purgecss({
        content: ['index.html']
    }))
    .pipe(dest('src/css/'))
};

const concatAndMinifyCss = () => {
    return src('src/*/*.css')
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS())
        .pipe(dest('src/css/min/'))
};

const concatAndMinifyJs = () => {
    return src('src/*/*.js')
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js/min/'))
};

const copyCssAndJs = () => {
    return src('src/css/min/styles.min.css', {allowEmpty: true})
        .pipe(dest('dist/css/'))
        .pipe(src('src/js/min/scripts.min.js', {allowEmpty: true}))
        .pipe(dest('dist/js/'))
};

const optimImgAndCopy = () => {
    return src('src/img/**')
        .pipe(imagemin())
        .pipe(dest('dist/img'))
};

const bs = () => {browserSync.init({
    server: {
        baseDir: "./",
    },
})};
const bsReload = () => {
    return browserSync.reload;
}
const watcher = () =>{
    bs();
    watch('src/*/*.scss', series(compileCSS,addPrefix,garbageCss,concatAndMinifyCss,copyCssAndJs));
    watch('src/*/*.js', series(concatAndMinifyJs,copyCssAndJs));
    watch('src/img/*.*', series(optimImgAndCopy));
    watch('index.html').on('change',  bsReload());
    watch('dist/').on('change',  bsReload());
}

task('build', series(cleanDist, compileCSS, addPrefix, garbageCss, concatAndMinifyCss, concatAndMinifyJs, copyCssAndJs, optimImgAndCopy));

task('dev', series(series(cleanDist, compileCSS, addPrefix, garbageCss, concatAndMinifyCss, concatAndMinifyJs, copyCssAndJs, optimImgAndCopy), watcher));