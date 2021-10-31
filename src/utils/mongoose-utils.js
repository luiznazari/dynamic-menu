const mongoose = require('mongoose');

function toObjectId(obj) {
  if (obj instanceof mongoose.Types.ObjectId) {
    return obj;
  }
  return mongoose.Types.ObjectId(obj);
}

function isSameObjectId(id1, id2) {
  if (!id1 || !id2) {
    return false;
  }
  return toObjectId(id1).id.compare(toObjectId(id2).id) === 0;
}

module.exports = {
  isSameObjectId
}