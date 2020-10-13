var FontMenuItem = function (domNode, fontMenu) {
    this.domNode   = domNode;
    this.fontMenu = fontMenu;
    this.font     = '';
};

FontMenuItem.prototype.init = function () {
    this.domNode.setAttribute('tabindex', '-1');

    if (!this.domNode.getAttribute('role')) {
        this.domNode.setAttribute('role', 'menuitemradio');
    }

    this.font = this.domNode.textContent.trim().toLowerCase();
    this.domNode.addEventListener('click',      this.handleClick.bind(this));
    this.domNode.addEventListener('mouseover',  this.handleMouseover.bind(this));
    this.domNode.addEventListener('mouseout',   this.handleMouseout.bind(this));
};

/* EVENT HANDLERS */

FontMenuItem.prototype.handleClick = function (event) {
    this.fontMenu.setFontFamily(this, this.font);
    this.fontMenu.setFocusToFirstItem();
    this.fontMenu.close(true);
};

FontMenuItem.prototype.handleMouseover = function (event) {
    this.fontMenu.hasHover = true;
    this.fontMenu.open();
};

FontMenuItem.prototype.handleMouseout = function (event) {
    this.fontMenu.hasHover = false;
    setTimeout(this.fontMenu.close.bind(this.fontMenu, false), 300);
};