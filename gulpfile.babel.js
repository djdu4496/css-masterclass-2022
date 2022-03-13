import gulp from 'gulp';
import del from 'del';
import watch from 'gulp-watch';
import ws from 'gulp-webserver';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoPrefixer from 'gulp-autoprefixer';
import miniCSS from 'gulp-csso';
import ghPages from 'gulp-gh-pages';

const sass = gulpSass(dartSass);

// 경로 분기
const routes = {
  html : {
    src: "index.html",
    dest: "build",
    watch: "**/*.html"
  },
  css : {
    src: "src/scss/style.scss",
    dest: "build/css",
    watch: "src/scss/*.scss"
  },

}

// 로컬 서버 설치
const webserver = () => 
  gulp.src(routes.html.dest).pipe(ws({ livereload: true }));

// 빌드 삭제
const clean = () => del(['build/']);

// 이미지 파일 호환
const img = () => 
  gulp.src()

// html 빌드용 폴더에 저장
const html = () => 
  gulp.src(routes.html.src)
  .pipe(gulp.dest(routes.html.dest));

// scss 파일을 css로 컴파일
const styles = () => 
  gulp.src(routes.css.src)
  .pipe(sass().on('error', sass.logError))
  .pipe(autoPrefixer())
  .pipe(miniCSS())
  .pipe(gulp.dest(routes.css.dest));

// 실시간 수정 반영
const watches = () => {
  watch(routes.html.watch, html);
  watch(routes.css.watch, styles);
}

// 배포
const deployTask = () => 
  gulp.src('build/')
  .pipe(ghPages());

  
const prepare = gulp.series([clean]);
const assets = gulp.series([html, styles]);
const live = gulp.series([webserver, watches]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, deployTask, clean]);