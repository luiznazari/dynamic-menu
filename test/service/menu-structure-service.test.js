const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { MenuSchema } = require('../../src/domain/schema/menu');
const MenuTreeItem = require('../../src/domain/schema/menu-tree-item');
const MenuRepository = require('../../src/repository/menu-repository');
const MenuStructureService = require('../../src/service/menu-structure-service');
const mockDataFindAll = require('../mocks/menu-findall.json');

function toObjectId(id) {
  return new mongoose.Types.ObjectId(id);
}

describe('MenuStructureService', () => {

  describe('Menu tree', () => {
    it('should create menu tree from menu model list', async () => {
      sinon.stub(MenuRepository.prototype, 'findAll').resolves(mockDataFindAll.complex);

      const service = new MenuStructureService();
      const menuTree = await service.getMenuTree();

      expect(menuTree.length).to.be.eq(2, 'There should be 2 root menu itens.');
      expect(menuTree[0].id).to.be.eq('617f22bf4373300d8e8c1087');
      expect(menuTree[0].submenus.length).to.be.eq(0);
      expect(menuTree[1].id).to.be.eq('617f22cc4373300d8e8c108a');
      expect(menuTree[1].submenus.length).to.be.eq(2);
      expect(menuTree[1].submenus[0].id).to.be.eq('617f22d14373300d8e8c108d');
      expect(menuTree[1].submenus[1].id).to.be.eq('617f22cc4373300d8e8c108b');
      expect(menuTree[1].submenus[0].submenus.length).to.be.eq(1);
      expect(menuTree[1].submenus[0].submenus[0].id).to.be.eq('617f22cc4373300d8e8c108c');
      expect(menuTree[1].submenus[1].submenus.length).to.be.eq(0);
    });

    it('should create menu tree with specific schema', async () => {
      sinon.stub(MenuRepository.prototype, 'findAll').resolves(mockDataFindAll.simple);

      const service = new MenuStructureService();
      const menuTree = await service.getMenuTree();

      expect(menuTree).to.be.an('array');
      expect(menuTree[0]).to.be.an.instanceOf(MenuTreeItem);
      expect(menuTree[0].id).to.be.eq('617f22cc4373300d8e8c108a');
      expect(menuTree[0].name).to.be.eq('Menu 1');
      expect(menuTree[0].submenus).to.be.an('array');
      expect(menuTree[0].submenus[0]).to.be.an.instanceof(MenuTreeItem);
      expect(menuTree[0].submenus[0].name).to.be.eq('Menu 3');
    });
  });

  describe('Cyclic menu', () => {

    it('should check if submenu references itself', async () => {
      sinon.stub(MenuRepository.prototype, 'findAll').resolves(mockDataFindAll.simple);

      const menuSchema = new MenuSchema();
      menuSchema.id = '617f22cc4373300d8e8c108a';
      menuSchema.parent_menu_id = '617f22cc4373300d8e8c108a';

      const service = new MenuStructureService();
      const result = await service.isCyclicMenu(menuSchema);

      expect(result).to.be.true;
    });

    it('should check if item is a submenu of one of own submenus', async () => {
      const findChildrenStub = sinon.stub(MenuRepository.prototype, 'findChildrenByParentId');

      findChildrenStub.withArgs('617f22cc4373300d8e8c108a')
        .resolves([toObjectId('617f22d14373300d8e8c108d'), toObjectId('617f22cc4373300d8e8c108b')]);

      findChildrenStub.withArgs('617f22d14373300d8e8c108d')
        .resolves([toObjectId('617f22cc4373300d8e8c108c'), toObjectId('617f22cc4373300d8e8c108e')]);
      findChildrenStub.withArgs('617f22cc4373300d8e8c108b').resolves([]);

      findChildrenStub.withArgs('617f22cc4373300d8e8c108c')
        .resolves([toObjectId('617f22bf4373300d8e8c1087')]);
      findChildrenStub.withArgs('617f22cc4373300d8e8c108e').resolves([]);

      findChildrenStub.withArgs('617f22bf4373300d8e8c1087').resolves([]);

      const menuSchema = new MenuSchema();
      menuSchema.id = '617f22cc4373300d8e8c108a';
      menuSchema.parent_menu_id = '617f22bf4373300d8e8c1087';

      const service = new MenuStructureService();
      const result = await service.isCyclicMenu(menuSchema);

      expect(result).to.be.true;
    });

    it('should validate non-cyclic item and submenus', async () => {
      const findChildrenStub = sinon.stub(MenuRepository.prototype, 'findChildrenByParentId');

      findChildrenStub.withArgs('617f22cc4373300d8e8c108a')
        .resolves([toObjectId('617f22d14373300d8e8c108d'), toObjectId('617f22cc4373300d8e8c108b')]);

      findChildrenStub.withArgs('617f22d14373300d8e8c108d')
        .resolves([toObjectId('617f22cc4373300d8e8c108c')]);
      findChildrenStub.withArgs('617f22cc4373300d8e8c108b').resolves([]);

      findChildrenStub.withArgs('617f22cc4373300d8e8c108c').resolves([]);

      const menuSchema = new MenuSchema();
      menuSchema.id = '617f22cc4373300d8e8c108a';
      menuSchema.parent_menu_id = '617f22bf4373300d8e8c1087';

      const service = new MenuStructureService();
      const result = await service.isCyclicMenu(menuSchema);

      expect(result).to.be.false;
    });

  });

  afterEach(() => {
    sinon.restore();
  });
});
