var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename');
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');
    bsConfig = require("gulp-bootstrap-configurator");
    
gulp.task('make-bootstrap-css', function(){
  return gulp.src("./config.json")
    .pipe(bsConfig.css({
       compress: true,
      bower: true,
      name: 'grid.css'
  }))
    .pipe(gulp.dest("app/css"));
   
});

gulp.task('sass', function() {
    return gulp.src('app/sass/style.scss')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions','>1%','ie 8','ie 7'],{cascade:true}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream:true}))
});
gulp.task('scripts',function(){
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});
gulp.task('css-libs', function(){
    return gulp.src('app/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('app/css'));
});
gulp.task('clean',function(){
    return del.sync('dist');
});
gulp.task('clear',function(){
    return cache.clearAll();
});
gulp.task('browser-sync',function(){
    browserSync({
        server:{
            baseDir:'app'
        },
        notify:false
    });
});
gulp.task('img',function(){
   return gulp.src('app/img/**/*')
   .pipe(cache(imagemin({
       interlaced:true,
       progressive:true,
       svgoPlugins:[{removeViewBox:false}],
        use:[pngquant()]
         
   })))
    .pipe(gulp.dest('dist/img'));
});
gulp.task('watch',['browser-sync','css-libs','sass','scripts'],function(){
    gulp.watch('app/sass/*.scss',['sass']);
    gulp.watch('app/**/*.html',browserSync.reload);
    gulp.watch('app/js/**/*.html',browserSync.reload);
});

gulp.task('build',['clean','img','sass','scripts'],function(){
    var buildCss=gulp.src([
        'app/css/style.css',
        'app/css/libs.min.css',
    ])
    .pipe(gulp.dest('dist/css'));
    
    var buildFonts=gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
    
    var buildsJs=gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));
    
    var buildHtml=gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
})