import * as riot from './riot'
import $ from 'bianco.query'
import compiler from '@riotjs/compiler/dist/compiler'
import {get as getAttr} from 'bianco.attr'

const GLOBAL_REGISTRY = '__riot_registry__'
window[GLOBAL_REGISTRY] = {}

// evaluates a compiled tag within the global context
function globalEval(js, url) {
  const node = document.createElement('script')
  const root = document.documentElement

  // make the source available in the "(no domain)" tab
  // of Chrome DevTools, with a .js extension
  if (url) js += `\n//# sourceURL=${url}.js`

  node.text = js
  root.appendChild(node)
  root.removeChild(node)
}

compiler.registerPostprocessor(async function(code){
  // cheap transpilation
  return {
    code: `(function (global){${code}})(this)`.replace('export default', 'return'),
    map: {}
  }
})

async function compileFromUrl(url) {
  const response = await fetch(url)
  const code = await response.text()

  return await compiler.compile(code, { file: url })
}

async function compileFromString(string, options) {
  return await compiler.compile(string, options)
}

async function compile() {
  const scripts = $('script[type="riot"]')
  const urls = scripts.map(s => getAttr(s, 'src') || getAttr(s, 'data-src'))
  const tags = await Promise.all(urls.map(compileFromUrl))

  tags.forEach(({code, meta}, i) => {
    const url = urls[i]
    const {tagName} = meta

    globalEval(`window.${GLOBAL_REGISTRY}['${tagName}'] = ${code}`, url)
    riot.register(tagName, window[GLOBAL_REGISTRY][tagName])
  })
}

export default {
  ...riot,
  compile,
  compileFromString,
  compileFromUrl
}
