'use strict'
const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const pug = require('gulp-pug')
const ejs = require('gulp-ejs')

function error (value) {
	value = value || undefined
	console.error(`[error] ${value}`)
	process.exit(1)
}

function resolveInput (value) {
	if (!value) error('Input not defined!')
	if (path.parse(value).name === '*') value = path.dirname(path.parse(value).dir)
	if (fs.lstatSync(value).isFile()) value = path.dirname(value)
	if (fs.lstatSync(value).isDirectory()) {
		let dirname = value
		value = fs.readdirSync(value)
			.filter(file => path.parse(file).ext === '.pug' || path.parse(file).ext === '.ejs')
		value = value[0] ? path.resolve(dirname, `**/*${path.parse(value[0]).ext}`) : error('File not found!')
	}
	return path.resolve(value)
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
				case '.pug':
					compile = pug
					break
				case '.ejs':
					compile = ejs
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
