module.exports = leftpad;
function leftpad (str, len, ch) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
}

//simple version
module.exports = function(str, width, char) {

char = char || '0';

str = str.toString();

while (str.length < width) str = char + str;

return str;

};

//pad(25,5)
function pad(source, length) {

var pre = "",

negative = (source < 0),

string = String(Math.abs(source));

if (string.length < length) {

pre = (new Array(length - string.length + 1)).join('0');

}

return (negative ?  "-" : "") + pre + string;

};
