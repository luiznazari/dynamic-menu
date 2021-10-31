const Joi = require('joi');

class Menu {
  _id;
  name;
  submenus;
}

const MenuJoiSchema = Joi.object().keys({
  key_type: Joi.object().keys({
    id: Joi.string().optional(),
    name: Joi.string().required(),
    submenus: Joi.array().optional().items(
      Joi.object().keys({
        id: Joi.string().required()
      })
    )
  })
})

module.exports = {
  Menu,
  MenuJoiSchema
};