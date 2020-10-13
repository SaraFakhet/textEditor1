FontMenuButton = function (node, toolbar, toolbarItem) {
    this.domNode = node;
    this.fontMenu = false;
    this.toolbar = toolbar;
    this.toolbarItem = toolbarItem;

    this.buttonAction = 'font-family';
    this.value = '';
};

FontMenuButton.prototype.init = function () {
    var id = this.domNode.getAttribute('aria-controls');

    if (id) {
        var node = document.getElementById(id);
        if (node) {
            this.fontMenu = new FontMenu(node, this);
            this.fontMenu.init();
        }
    }
    this.domNode.addEventListener('click', this.handleClick.bind(this));
	
	socket.on('font', (font) => {
		this.value = font;
		this.domNode.innerHTML = font.toUpperCase() + '<span></span>';
		this.domNode.style.fontFamily = font;
		this.domNode.setAttribute('aria-label', 'Font: ' + font);
		this.toolbar.textarea.style.fontFamily = font;
	})
};

FontMenuButton.prototype.handleClick = function (event, menuButton) {
    if (this.fontMenu.isOpen()) {
        this.fontMenu.close();
    }
    else {
        this.fontMenu.open();
    }
};

FontMenuButton.prototype.setFontFamily = function (font) {
    this.value = font;
    this.domNode.innerHTML = font.toUpperCase() + '<span></span>';
    this.domNode.style.fontFamily = font;
    this.domNode.setAttribute('aria-label', 'Font: ' + font);
    this.toolbar.activateItem(this);
};