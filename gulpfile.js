// Configuration
var config = {
    paths: {
        src: {
            root: "./app",
            styles: "/styles/**/*.styl",
            styles_ignored: "/styles/**/_*.styl",
            scripts: "/scripts/**/*.js",
            images: "/assets/images/**/*.{jpg,jpeg,png,svg,gif}",
            fonts: "/assets/fonts/**/*.{woff,ttf,eof,svg}",
            markup: "/markup/**/*.pug",
            markup_ignored: "/markup/**/_*.pug"
        },
        dest: {
            root: "./docs",
            styles: "/assets",
            scripts: "/assets",
            images: "/assets/images",
            fonts: "/assets/fonts"
        }
    },
    template_processor: "pug",
    css_processor: "stylus",
    js_processor: null
}

// Initialization
var gulp = require('gulp')
var stylus = require('gulp-stylus')
var concat = require('gulp-concat')
var minify = require('gulp-minify-css')
var autoprefixer = require('gulp-autoprefixer')
var uglify = require('gulp-uglify')
var imagemin = require('gulp-imagemin')
var pug = require('gulp-pug')
var browser_sync = require('browser-sync').create()
var newer = require('gulp-newer')

// Gulp tasks
task('styles', function() {
    gulp.src([config.paths.src.root + config.paths.src.styles, 
             "!" + config.paths.src.root + config.paths.src.styles_ignored])
        .pipe(autoprefixer())
        .pipe(stylus({'include css': true, compress: true}))
        .pipe(minify())
        .pipe(gulp.dest(config.paths.dest.root + config.paths.dest.styles))
        .pipe(browser_sync.stream())
})

task('scripts', function() {
    gulp.src([config.paths.src.scripts])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.dest.root + config.paths.dest.scripts))
        .pipe(browser_sync.stream())
})

task('images', function() {
    gulp.src(config.paths.src.root + config.paths.src.images)
        .pipe(newer(config.paths.src.root + config.paths.src.images))
        .pipe(imagemin())
        .pipe(gulp.dest(config.paths.dest.root + config.paths.dest.images))
        .pipe(browser_sync.stream())
})

task('fonts', function() {
    gulp.src(config.paths.src.root + config.paths.src.fonts)
        .pipe(gulp.dest(config.paths.dest.root + config.paths.dest.fonts))
        .pipe(browser_sync.stream())
})

task('markup', function() {
    gulp.src([config.paths.src.root + config.paths.src.markup, 
             "!" + config.paths.src.root + config.paths.src.markup_ignored])
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(config.paths.dest.root))
})

task('build', ['styles', 'scripts', 'images', 'fonts', 'markup'])

gulp.task('server', ['build'], function() {
    browser_sync.init({server: config.paths.dest.root})

    gulp.watch(config.paths.src.root + config.paths.src.styles, ['styles'])
    gulp.watch(config.paths.src.scripts, ['scripts'])
    gulp.watch(config.paths.src.root + config.paths.src.markup, ['markup'])
    gulp.watch(config.paths.src.root + config.paths.src.images, ['images'])
    gulp.watch(config.paths.dest.root + '/**/*').on('change', browser_sync.reload)
})

// Functions
function task(name, callback) {
    gulp.task(name, callback)
}