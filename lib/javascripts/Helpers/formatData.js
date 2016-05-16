import d3 from 'd3';
/**
 * @function formatData
 * @param  {Number} value   [description]
 * @param  {String} prefix  [description]
 * @param  {String} suffix  [description]
 * @param  {Boolean} rounded [description]
 * @return {String}         [description]
 */
const formatData = function(value, prefix, suffix, rounded) {
    if(value == null){
      return 'no data';
    }
    if(rounded){
      return prefix + parseInt(value) + suffix;
    }
    if(value > 1 || value < -1) {
      return prefix + d3.format('.2s')(value) + suffix;
    } else {
      return prefix + d3.format('.2f')(value) + suffix;
    }
}

module.exports = formatData;
