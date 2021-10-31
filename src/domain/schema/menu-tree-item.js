class MenuTreeItem {

  id;
  name;
  submenus = [];

  static fromModel(model) {
    const menuItem = new MenuTreeItem();
    menuItem.id = model._id;
    menuItem.name = model.name;
    return menuItem;
  }

}

module.exports = MenuTreeItem;