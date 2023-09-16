const fs = require('fs')
const path = require('path')
const UglifyJS = require('uglify-js')
const CleanCSS = require('clean-css')

const jsFolder = './build/assets/js/'
const cssFolder = './build/assets/css/'

//=====================================================
const minifyJsFolders = ( jsFolder ) => {
// Minify all JS files in the jsFolder
  fs.readdir(jsFolder, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`)
      return
    }

    files.forEach(file => {
      const filePath = path.join(jsFolder, file)
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading file: ${err.message}`)
          return
        }

        try {
          const result = UglifyJS.minify(data)
          if (result.error) {
            console.error(`Error minifying file: ${result.error}`)
            return
          }
          const minifiedFilePath = path.join(jsFolder, `${file}`)
          fs.writeFile(minifiedFilePath, result.code, 'utf8', err => {
            if (err) {
              console.error(`Error writing file: ${err.message}`)
              return
            }
          })
        } catch (err) {
          console.error(`Error processing file: ${err.message}`)
          return
        }
      })
    })
  })
}
const minifyCssFolders = ( cssFolder ) => {
// Minify all CSS files in the cssFolder
  fs.readdir(cssFolder, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`)
      return
    }

    files.forEach(file => {
      const filePath = path.join(cssFolder, file)
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading file: ${err.message}`)
          return
        }

        try {
          const result = new CleanCSS({}).minify(data)
          const minifiedFilePath = path.join(cssFolder, `${file}`)
          fs.writeFile(minifiedFilePath, result.styles, 'utf8', err => {
            if (err) {
              console.error(`Error writing file: ${err.message}`)
              return
            }
          })
        } catch (err) {
          console.error(`Error processing file: ${err.message}`)
          return
        }

      })
    })
  })
}
//=====================================================
minifyJsFolders(jsFolder)
minifyCssFolders(cssFolder)
