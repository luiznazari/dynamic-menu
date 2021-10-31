const Joi = require('joi');
const { Validators } = require('../../utils/schema-validator');

class MenuSchema {
  id;
  name;
  parent_menu_id;

  static fromBody(body) {
    const menu = new MenuSchema();
    menu.id = body.id;
    menu.name = body.name;
    menu.parent_menu_id = body.parent_menu_id;
    return menu;
  }

  static fromModel(model) {
    const menu = new MenuSchema();
    menu.id = model._id;
    menu.name = model.name;
    menu.parent_menu_id = model.relatedId;
    return menu;
  }
}

const menuJoiSchema = Joi.object({
  name: Joi.string().required().max(256),
  parent_menu_id: Joi.string().optional()
    .custom((value, helper) => Validators.validObjectId(value, helper, 'parent_menu_id'))
});

module.exports = {
  MenuSchema,
  menuJoiSchema
};