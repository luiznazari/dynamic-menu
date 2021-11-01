const Menu = require('../domain/model/menu-model');

class MenuRepository {

  findAll() {
    return Menu.find();
  }

  findChildrenByParentId(id) {
    return Menu.find({ relatedId: id }, '_id');
  }

  findById(id) {
    return Menu.find({ _id: id });
  }

  existsById(id) {
    return Menu.exists({ _id: id });
  }

  existsByRelatedId(relatedId) {
    return Menu.exists({ relatedId });
  }

  findIdByName(name) {
    return Menu.findOne({ name }, '_id');
  }

  deleteById(id) {
    return Menu.deleteOne({ _id: id });
  }

  save(menu) {
    return menu.save();
  }

  updateById(id, fields) {
    return Menu.updateOne({ _id: id }, fields);
  }

}

module.exports = MenuRepository;