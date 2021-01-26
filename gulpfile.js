const gulp = require('gulp');
const path = require('path');
const { convertAllFonts  } = require('@hayes0724/web-font-converter');
const hbjs = require('handbrake-js');
var flatmap = require('gulp-flatmap');
const node_xj = require("xls-to-json");


/*Export fonts
ttf -> woff
ttf -> woff2
svg -> ttf
svg -> ttf -> woff
svg -> ttf -> woff2
otf -> svg
otf -> svg -> ttf
otf -> svg -> ttf -> woff
otf -> svg -> ttf -> woff2 */
const convertFont = module.exports = function(){
  convertAllFonts ({
    pathIn: './fonts/input-fonts',
    pathOut: './fonts/output-fonts',
    outputFormats: ['.woff2'], 
    inputFormats: ['.otf'],
    debug: false
  })
}
gulp.task('convertFont', convertFont);




/* Convert video (handbrake-js) example for webm -> mp4 */
const convertVideo = module.exports = function(){ 

  return gulp.src('./video-converter/input-webm/*.webm')

	.pipe(
    flatmap(function(stream,file){      
      var filename = path.basename(file.path);
      var justfilename = path.basename(file.path, '.webm');
      console.log( 'File to conver: ',filename);
      hbjs.spawn({ input: './video-converter/input-webm/'+filename, output: './video-converter/output-mp4/'+justfilename+'.mp4', crop: 'no-loose-crop' })
      .on('error', err => {
        console.log('error: invalid user input');
      })

      .on('progress', progress => {
        console.log(
          'Percent complete: %s, ETA: %s',
          progress.percentComplete,
          progress.eta
        )
      })
      return stream;
      })      
    );
    
}
gulp.task('convertVideo', convertVideo);

// var build = gulp.series();

// exports.default = build;
// notworking
const xlstojson = module.exports = function(){ 

  node_xj(
    {
        input: "./xls-to-json/spispna.xls", // input xls
        output: "./xls-to-json/output.json", // output json
        sheet: "sheetname", // specific sheetname
        rowsToSkip: 0, // number of rows to skip at the top of the sheet; defaults to 0
        allowEmptyKey: true, // avoids empty keys in the output, example: {"": "something"}; default: true
    },
    async function (err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(result);
        }
    }
  );
}  
gulp.task('xlstojson', xlstojson);
