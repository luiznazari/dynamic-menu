const LogEvent = require('../utils/log-event');
const MenuService = require('../service/menu-service');
const ResponseUtils = require('../utils/response-utils');
const { RequestValidator, Validators } = require('../utils/request-validator');

class MenuController {
  #menuService = new MenuService();

  async getById(req, res) {
    try {
      RequestValidator.validateParameters(req, [['id', Validators.validObjectId]]);
      const id = req.params.id;
      const response = await this.#menuService.getById(id);
      return ResponseUtils.ok(res, response);
    } catch (error) {
      LogEvent.error(error).log();
      return ResponseUtils.error(res, error);
    }
  }

  async create(req, res) {
    try {
      // const { body } = req;
      // const schemaValidator = new SchemaValidator(menuJoiSchema);
      // schemaValidator.validate(body);

      // const menuSchema = new MenuSchema();
      // menuSchema.buildWithReqBody(body);

      // const response = await this.#menuBusiness.create(menuSchema, session);

      const response = 'response';
      return ResponseUtils.ok(res, response);
    } catch (error) {
      new LogEvent(LOG_LEVEL.ERROR, error.message).log();
      return ResponseUtils.error(res, error);
    }
  }

}

module.exports = MenuController;
