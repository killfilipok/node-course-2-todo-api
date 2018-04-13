var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    minlength: 2,
    trim: true,
    require: true
  }
});

module.exports = {User};
