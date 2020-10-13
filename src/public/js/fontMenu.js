var FontMenu = function (domNode, controllerObj) {
    var elementChildren,
        msgPrefix = 'FontMenu constructor argument domNode ';

    var childElement = domNode.firstElementChild;

    while (childElement) {
        var menuitem = childElement.firstElementChild;
        childElement = childElement.nextElementSibling;
    }

    this.domNode = domNode;
    this.controller = controllerObj;

    this.menuitems = [];      // See PopupMenu init method
    this.firstChars = [];      // See PopupMenu init method

    this.firstItem = null;    // See PopupMenu init method
    this.lastItem = null;    // See PopupMenu init method

    this.hasFocus = false;   // See MenuItem handleFocus, handleBlur
    this.hasHover = false;   // See PopupMenu handleMouseover, handleMouseout
};


FontMenu.prototype.init = function () {
    var menuitemElements, menuitemElement, menuItem, textContent, numItems;

    // Configure the domNode itself
    this.domNode.setAttribute('tabindex', '-1');

    this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
    this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

    // Traverse the element children of domNode: configure each with
    // menuitem role behavior and store reference in menuitems array.
    var menuitemElements = this.domNode.querySelectorAll('[role="menuitemradio"]');

    for (var i = 0; i < menuitemElements.length; i++) {
        menuitemElement = menuitemElements[i];
        menuItem = new FontMenuItem(menuitemElement, this);
        menuItem.init();
        this.menuitems.push(menuItem);
        textContent = menuitemElement.textContent.trim();
        this.firstChars.push(textContent.substring(0, 1).toLowerCase());
    }

    // Use populated menuitems array to initialize firstItem and lastItem.
    numItems = this.menuitems.length;
    if (numItems > 0) {
        this.firstItem = this.menuitems[0];
        this.lastItem = this.menuitems[numItems - 1];
    }
};

FontMenu.prototype.handleMouseover = function (event) {
    this.hasHover = true;
};

FontMenu.prototype.handleMouseout = function (event) {
    this.hasHover = false;
    setTimeout(this.close.bind(this, false), 300);
};

FontMenu.prototype.setFontFamily = function (menuitem, font) {
    for (var i = 0; i < this.menuitems.length; i++) {
        var mi = this.menuitems[i];
        mi.domNode.setAttribute('aria-checked', mi === menuitem);
    }
    this.controller.setFontFamily(font);
};

FontMenu.prototype.setFocusToFirstItem = function () {
    this.firstItem.domNode.focus();
};

FontMenu.prototype.setFocusToCheckedItem = function () {
    for (var index = 0; index < this.menuitems.length; index++) {
        if (this.menuitems[index].domNode.getAttribute('aria-checked') === 'true') {
            this.menuitems[index].domNode.focus();
        }
    }
};

FontMenu.prototype.setFocus = function () {
    this.hasFocus = true;
    this.domNode.classList.add('focus');
    this.controller.toolbar.domNode.classList.add('focus');
};

FontMenu.prototype.removeFocus = function () {
    this.hasFocus = false;
    this.domNode.classList.remove('focus');
    this.controller.toolbar.domNode.classList.remove('focus');
    setTimeout(this.close.bind(this, false), 300);
};

/* MENU DISPLAY METHODS */

FontMenu.prototype.isOpen = function () {
    return this.controller.domNode.getAttribute('aria-expanded') === 'true';
};

FontMenu.prototype.open = function () {
    // Get bounding rectangle of controller object's DOM node
    var rect = this.controller.domNode.getBoundingClientRect();

    // Set CSS properties
    this.domNode.style.display = 'block';
    this.domNode.style.position = 'absolute';
    this.domNode.style.top = (rect.height - 1) + 'px';
    this.domNode.style.left = '0px';
    this.domNode.style.zIndex = 100;

    // Set aria-expanded attribute
    this.controller.domNode.setAttribute('aria-expanded', 'true');
};

FontMenu.prototype.close = function (force) {
    if (typeof force !== 'boolean') {
        force = false;
    }

    if (force || (!this.hasFocus && !this.hasHover && !this.controller.hasHover)) {
        this.domNode.style.display = 'none';
        this.controller.domNode.removeAttribute('aria-expanded');
    }
};