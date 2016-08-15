var args = require('yargs')
    .default('output', 'map.svg')
    .default('height', 500)
    .default('width', 500)
    .argv

var fs = require('fs')
var jsdom = require('jsdom')
var _ = require('underscore')

var terrain = fs.readFileSync("./terrain/terrain.js", "utf-8")
var d3src = fs.readFileSync("./node_modules/d3/build/d3.js", "utf-8")
var pqsrc = fs.readFileSync("./node_modules/js-priority-queue/priority-queue.js", "utf-8")
var langsrc = fs.readFileSync("./naming-language/language.js", "utf-8")
var stylesrc = fs.readFileSync("./styles.css", "utf-8")

var params = {}
if (args.params) {
    params = JSON.parse(fs.readFileSync(args.params))
}

jsdom.env({
    html: '',
    features: { QuerySelector: true },
    src: [terrain, d3src, pqsrc, langsrc],
    done: function(errors, window) {
        var svg = window.d3.select('body')
            .append('div')
              .attr('class', 'container')
            .append('svg')
        svg.attr('height', args.height)
        svg.attr('width', args.width)
        svg.attr('xmlns', 'http://www.w3.org/2000/svg')
        svg.append("style").html(stylesrc)

        window.defaultParams = _.extend(window.defaultParams, params)

        console.log(window.defaultParams)
        window.doMap(svg, window.defaultParams)
        fs.writeFileSync(args.output, window.d3.select('.container').html())
        console.log(args.output + ' done')
    }
})


