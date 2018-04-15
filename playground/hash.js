// const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

var token = jwt.sign(data, '123abc');

console.log(token);
var decodet = jwt.verify(token, '123abc')
console.log(decodet);
// var message = "i m user number 3";
// var hash = SHA256(message).toString();
//
// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// var data = {
//   id: 4
// };
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'philip secret').toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data).toString())
//
// var resHash = SHA256(JSON.stringify(token.data) + 'philip secret').toString();
// if(resHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Do not trust!');
// }
