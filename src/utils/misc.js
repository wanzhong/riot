/* eslint-disable fp/no-mutating-methods */
import {isFunction} from './checks'
/**
 * Throw an error
 * @param {string} error - error message
 * @returns {undefined} it's a IO void function
 */
export function panic(error) {
  throw new Error(error)
}

/**
 * Call the first argument received only if it's a function otherwise return it as it is
 * @param   {*} source - anything
 * @returns {*} anything
 */
export function callOrAssign(source) {
  return isFunction(source) ? (source.prototype && source.prototype.constructor ?
    new source() : source()
  ) : source
}

/**
 * Define default properties if they don't exist on the source object
 * @param   {Object} source - object that will receive the default properties
 * @param   {Object} defaults - object containing additional optional keys
 * @returns {Object} the original object received enhanced
 */
export function defineDefaults(source, defaults) {
  Object.entries(defaults).forEach(([key, value]) => {
    if (!source[key]) source[key] = value
  })

  return source
}

// doese simply nothing
export function noop() {
  return this
}

/**
 * Autobind the methods of a source object to itself
 * @param   {Object} source - probably a riot tag instance
 * @param   {Array<string>} methods - list of the methods to autobind
 * @returns {Object} the original object received
 */
export function autobindMethods(source, methods) {
  methods.forEach(method => {
    source[method] = source[method].bind(source)
  })

  return source
}

/**
 * Helper function to set an immutable property
 * @param   {Object} source - object where the new property will be set
 * @param   {string} key - object key where the new property will be stored
 * @param   {*} value - value of the new property
 * @param   {Object} options - set the propery overriding the default options
 * @returns {Object} - the original object modified
 */
export function defineProperty(source, key, value, options = {}) {
  Object.defineProperty(source, key, {
    value,
    enumerable: false,
    writable: false,
    configurable: true,
    ...options
  })

  return source
}

/**
 * Define multiple properties on a target object
 * @param   {Object} source - object where the new properties will be set
 * @param   {Object} properties - object containing as key pair the key + value properties
 * @param   {Object} options - set the propery overriding the default options
 * @returns {Object} the original object modified
 */
export function defineProperties(source, properties, options) {
  Object.entries(properties).forEach(([key, value]) => {
    defineProperty(source, key, value, options)
  })

  return source
}

/**
 * Evaluate a list of attribute expressions
 * @param   {Array} attributes - attribute expressions generated by the riot compiler
 * @param   {Object} scope - current scope
 * @returns {Object} key value pairs with the result of the computation
 */
export function evaluateAttributeExpressions(attributes, scope) {
  return attributes.reduce((acc, attribute) => {
    const value = attribute.evaluate(scope)

    acc[attribute.name] = value

    return acc
  }, {})
}