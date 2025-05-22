const gulp          = require('gulp');
const sass          = require('gulp-sass');
const uglify        = require('gulp-uglify');
const rename        = require('gulp-rename');
const concat        = require('gulp-concat');
const cleanCSS      = require('gulp-clean-css');
const imageMin      = require('gulp-imagemin');
const pngQuint      = require('imagemin-pngquant'); 
const browserSync   = require('browser-sync').create();
const autoprefixer  = require('gulp-autoprefixer');
const jpgRecompress = require('imagemin-jpeg-recompress'); 
const clean         = require('gulp-clean');

var paths = {
    root: { 
        www:        './atheanas_portfolio'
    },
    src: {
        root:       'atheanas_portfolio/assets',
        html:       'atheanas_portfolio/**/*.html',
        css:        'atheanas_portfolio/assets/css/*.css',
        js:         'atheanas_portfolio/assets/js/*.js',
        vendors:    'atheanas_portfolio/assets/vendors/**/*.*',
        imgs:       'atheanas_portfolio/assets/imgs/**/*.+(png|jpg|gif|svg)',
        scss:       'atheanas_portfolio/assets/scss/**/*.scss'
    },
    dist: {
        root:       'atheanas_portfolio/dist',
        css:        'atheanas_portfolio/dist/css',
        js:         'atheanas_portfolio/dist/js',
        imgs:       'atheanas_portfolio/dist/imgs',
        vendors:    'atheanas_portfolio/dist/vendors'
    }
}

gulp.task('sass', function() {
    return gulp.src(paths.src.scss)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) 
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.src.root + '/css'))
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
    return gulp.src(paths.src.css)
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('johndoe.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.css))
});

gulp.task('js', function() {
    return gulp.src(paths.src.js)
    .pipe(uglify())
    .pipe(concat('johndoe.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream());
});

gulp.task('img', function(){
    return gulp.src(paths.src.imgs)
    .pipe(imageMin([
        imageMin.gifsicle(),
        imageMin.jpegtran(),
        imageMin.optipng(),
        imageMin.svgo(),
        pngQuint(),
        jpgRecompress()
    ]))
    .pipe(gulp.dest(paths.dist.imgs));
});

gulp.task('vendors', function(){
    return gulp.src(paths.src.vendors)
    .pipe(gulp.dest(paths.dist.vendors))
});

gulp.task('clean', function () {
    return gulp.src(paths.dist.root)
        .pipe(clean());
});

gulp.task('build', gulp.series('sass', 'css', 'js', 'vendors', 'img'));

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: paths.root.www
        } 
    })
    gulp.watch(paths.src.scss, gulp.series('sass'));
    gulp.watch(paths.src.js).on('change', browserSync.reload);
    gulp.watch(paths.src.html).on('change', browserSync.reload);
});
