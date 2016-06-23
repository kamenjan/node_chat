/* Our application models are using knex to run queries against postgresql    *
 * database. If those queries should return something, result is always       *
 * stored in object. If there was no match we get an empty object and have    *
 * to check its content to determine if match was found. Hence this function. */
module.exports = function(obj) {

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}