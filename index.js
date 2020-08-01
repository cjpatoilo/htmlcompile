'use strict'
const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const ejs = require('gulp-ejs')
const haml = require('gulp-haml')
const hbs = require('gulp-handlebars')
const hogan = require('gulp-hogan')
const html = require('gulp-htmlmin')
const jade = require('gulp-jade')
const pug = require('gulp-pug')

function error (value) {
  value = value || undefined
  console.error(`[error] ${value}`)
  process.exit(1)
}

function resolveInput (value) {
  if (!fs.existsSync(value)) error('Input not exist.')
  if (fs.lstatSync(value).isFile()) error('Input should be a folder.')
  let dirname = value
  value = fs
    .readdirSync(value)
    .filter(
      file =>
        path.parse(file).ext === '.ejs' ||
        path.parse(file).ext === '.haml' ||
        path.parse(file).ext === '.hbs' ||
        path.parse(file).ext === '.hogan' ||
        path.parse(file).ext === '.html' ||
        path.parse(file).ext === '.jade' ||
        path.parse(file).ext === '.pug',
    )
  return value[0]
    ? path.resolve(dirname, `**/*${path.parse(value[0]).ext}`)
    : error('File not found.')
}

function resolveOutput (input, output) {
  if (!output) return path.dirname(path.dirname(input))
  return path.resolve(output)
}

function htmlcompile (input, output) {
  input = resolveInput(input)
  output = resolveOutput(input, output)

  return new Promise((resolve, reject) => {
    try {
      let compile
      switch (path.parse(input).ext) {
        case '.ejs':
          compile = ejs
          break
        case '.haml':
          compile = haml
          break
        case '.hbs':
          compile = hbs
          break
        case '.hogan':
          compile = hogan
          break
        case '.html':
          compile = html
          break
        case '.jade':
          compile = jade
          break
        case '.pug':
          compile = pug
          break
        default:
          error('Input not supported.')
      }
      gulp
        .src(input)
        .pipe(compile())
        .pipe(gulp.dest(output))
      console.info(`[info] Rendering Complete, saving .html file...`)
      console.info(`[info] Wrote HTML to ${output}`)
      resolve(output)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = htmlcompile
