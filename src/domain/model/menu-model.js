const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name can not be empty']
  },
  iconUrl: {
    type: String,
    required: false
  },
  realatedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }
});

const Menu = mongoose.model('Menu', menuSchema);


module.exports = Menu;