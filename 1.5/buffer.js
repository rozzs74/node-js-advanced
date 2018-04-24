// Example to understand the difference between buffered data and normal data using UTF8 string
const string = 'touché';
const buffer = Buffer.from('touché');

console.log(string, string.length);
console.log(buffer, buffer.length);
