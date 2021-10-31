const LogEvent = require('../utils/log-event');
const MenuService = require('../service/menu-service');
const ResponseUtils = require('../utils/response-utils');
const { RequestValidator, Validators } = require('../utils/request-validator');
const { SchemaValidator } = require('../utils/schema-validator');
const { MenuSchema, menuJoiSchema } = require('../domain/schema/menu');
const MenuStructureService = require('../service/menu-structure-service');

class MenuController {
  #menuService = new MenuService();
  #menuStructureService = new MenuStructureService();

  async list(req, res) {
    try {
      const menus = await this.#menuService.list();
      const response = menus.map(MenuSchema.fromModel);
      return ResponseUtils.ok(res, response);

    } catch (error) {
      new LogEvent(LOG_LEVEL.ERROR, error.message).log();
      return ResponseUtils.error(res, error);
    }
  }

  async create(req, res) {
    try {
      const { body } = req;
      const schemaValidator = new SchemaValidator(menuJoiSchema);
      schemaValidator.validate(body);

      const menuSchema = MenuSchema.fromBody(body);
      const menu = await this.#menuService.create(menuSchema);
      const response = { id: menu.id };
      return ResponseUtils.created(res, response);

    } catch (error) {
      LogEvent.error(error).log();
      return ResponseUtils.error(res, error);
    }
  }

  async getById(req, res) {
    try {
      RequestValidator.validateParameters(req, [['id', Validators.validObjectId]]);
      const id = req.params.id;
      const menu = await this.#menuService.getById(id);
      
      if (menu) {
        const response = MenuSchema.fromModel(menu);
        return ResponseUtils.ok(res, response);
      }
      return ResponseUtils.noContent(res);

    } catch (error) {
      LogEvent.error(error).log();
      return ResponseUtils.error(res, error);
    }
  }

  async update(req, res) {
    try {
      RequestValidator.validateParameters(req, [['id', Validators.validObjectId]]);
      const id = req.params.id;

      const { body } = req;
      const schemaValidator = new SchemaValidator(menuJoiSchema);
      schemaValidator.validate(body);

      const menuSchema = MenuSchema.fromBody(body);
      menuSchema.id = id;

      await this.#menuService.update(menuSchema);
      const response = { id };
      return ResponseUtils.ok(res, response);

    } catch (error) {
      LogEvent.error(error).log();
      return ResponseUtils.error(res, error);
    }
  }

  async deleteById(req, res) {
    try {
      RequestValidator.validateParameters(req, [['id', Validators.validObjectId]]);
      const id = req.params.id;
      const deleted = await this.#menuService.deleteById(id);

      if (deleted) {
        return ResponseUtils.ok(res, { id });
      }
      return ResponseUtils.noContent(res);

    } catch (error) {
      LogEvent.error(error).log();
      return ResponseUtils.error(res, error);
    }
  }

  async getMenu(req, res) {
    try {
      const response = await this.#menuStructureService.getMenuTree();
      return ResponseUtils.ok(res, response);

    } catch (error) {
      LogEvent.error(error).log();
      return ResponseUtils.error(res, error);
    }
  }

}

module.exports = MenuController;
