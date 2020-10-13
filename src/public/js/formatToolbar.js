FormatToolbar = function (domNode) {
    this.domNode = domNode;
    this.firstItem = null;
    this.lastItem = null;

    this.toolbarItems = [];
    this.alignItems = [];
    this.textarea = null;

    this.start = null;
    this.end = null;
    this.ourClipboard = '';
    this.selected = null;
};

FormatToolbar.prototype.init = function () {
    var i, items, toolbarItem, menuButton;

    this.textarea = document.getElementById(this.domNode.getAttribute('aria-controls'));

    items = this.domNode.querySelectorAll('.item');

    for (i = 0; i < items.length; i++) {
        toolbarItem = new FormatToolbarItem(items[i], this);
        toolbarItem.init();

        if (items[i].hasAttribute('aria-haspopup')) {
            menuButton = new FontMenuButton(items[i], this, toolbarItem);
            menuButton.init();
        }

        if (i === 0) {
            this.firstItem = toolbarItem;
        }
        this.lastItem = toolbarItem;
        this.toolbarItems.push(toolbarItem);
    }

    var spinButtons = this.domNode.querySelectorAll('[role=spinbutton]');;
    for (var i = 0; i < spinButtons.length; i++) {
        var s = new SpinButton(spinButtons[i], this);
        s.init();
    }
	
	socket.on('bold', (value) => {
		this.setBold(toolbarItem, value);
	})
	
	socket.on('underline', (value) => {
		this.setUnderline(toolbarItem, value);
	})
	
	socket.on('italic', (value) => {
		this.setItalic(toolbarItem, value);
	})
	
	socket.on('align', (value) => {
		toolbarItem.value = value;
		this.setAlignment(toolbarItem);
	})
	
	socket.on('font', (value) => {
		this.setFontFamily(value);
	})
};

FormatToolbar.prototype.setBold = function (toolbarItem, isBold) {
	this.setFocusItem(this.toolbarItems[0]);
    if (isBold) {
		this.textarea.style.fontWeight = 'bold';
        this.toolbarItems[0].setPressed();
    }
    else {
		this.textarea.style.fontWeight = 'normal';
        this.toolbarItems[0].resetPressed();
    }
};

FormatToolbar.prototype.toggleBold = function (toolbarItem) {
    if (toolbarItem.isPressed()) {
        this.textarea.style.fontWeight = 'normal';
        toolbarItem.resetPressed();
    }
    else {
        this.textarea.style.fontWeight = 'bold';
        toolbarItem.setPressed();
    }
};

FormatToolbar.prototype.setItalic = function (toolbarItem, isItalic) {
	this.setFocusItem(this.toolbarItems[1]);
    if (isItalic) {
		this.textarea.style.fontStyle = 'italic';
        this.toolbarItems[1].setPressed(); 
    }
    else {
		this.textarea.style.fontStyle = 'normal';
        this.toolbarItems[1].resetPressed();
    }
};

FormatToolbar.prototype.toggleItalic = function (toolbarItem) {
    if (toolbarItem.isPressed()) {
        this.textarea.style.fontStyle = 'normal';
        toolbarItem.resetPressed();
    }
    else {
        this.textarea.style.fontStyle = 'italic';
        toolbarItem.setPressed();
    }
};

FormatToolbar.prototype.setUnderline = function (toolbarItem, isUnderline) {
	this.setFocusItem(this.toolbarItems[2]);
    if (isUnderline) {
		this.textarea.style.textDecoration = 'underline';
        this.toolbarItems[2].setPressed();
    }
    else {
        this.textarea.style.textDecoration = 'none';
        this.toolbarItems[2].resetPressed();
    }
};

FormatToolbar.prototype.toggleUnderline = function (toolbarItem) {
    if (toolbarItem.isPressed()) {
        this.textarea.style.textDecoration = 'none';
        toolbarItem.resetPressed();
    }
    else {
        this.textarea.style.textDecoration = 'underline';
        toolbarItem.setPressed();
    }
};

FormatToolbar.prototype.changeFontSize = function (value) {
    this.textarea.style.fontSize = value + 'pt';
};

FormatToolbar.prototype.setAlignment = function (toolbarItem) {
    for (var i = 0; i < this.alignItems.length; i++) {
        this.alignItems[i].resetChecked();
    }
    switch (toolbarItem.value) {
        case 'left':
            this.textarea.style.textAlign = 'left';
            toolbarItem.setChecked();
            break;
        case 'center':
            this.textarea.style.textAlign = 'center';
            toolbarItem.setChecked();
            break;
        case 'right':
            this.textarea.style.textAlign = 'right';
            toolbarItem.setChecked();
            break;

        default:
            break;
    }
};

FormatToolbar.prototype.setFocusToFirstAlignItem = function () {
    this.setFocusItem(this.alignItems[0]);
};

FormatToolbar.prototype.setFocusToLastAlignItem = function () {
    this.setFocusItem(this.alignItems[2]);
};

FormatToolbar.prototype.setFontFamily = function (font) {
    this.textarea.style.fontFamily = font;
};

FormatToolbar.prototype.activateItem = function (toolbarItem) {
    switch (toolbarItem.buttonAction) {
        case 'bold':
            this.toggleBold(toolbarItem);
            socket.emit('bold');
            break;
        case 'underline':
            this.toggleUnderline(toolbarItem);
            socket.emit('underline');
            break;
        case 'italic':
            this.toggleItalic(toolbarItem);
            socket.emit('italic');
            break;
        case 'align':
            this.setAlignment(toolbarItem);
			socket.emit('align', toolbarItem.value);
            break;
        case 'font-family':
            this.setFontFamily(toolbarItem.value);
			socket.emit('font', toolbarItem.value);
            break;
        default:
            break;
    }
};

FormatToolbar.prototype.setFocusItem = function (item) {
    for (var i = 0; i < this.toolbarItems.length; i++) {
        this.toolbarItems[i].domNode.setAttribute('tabindex', '-1');
    }
    item.domNode.setAttribute('tabindex', '0');
    item.domNode.focus();
};

FormatToolbar.prototype.hidePopupLabels = function () {
    var tps = this.domNode.querySelectorAll('button .popup-label');
    tps.forEach(function (tp) {tp.classList.remove('show');});
};

window.addEventListener('load', function () {
    var toolbars = document.querySelectorAll('[role="toolbar"].format');
    for (var i = 0; i < toolbars.length; i++) {
        var toolbar = new FormatToolbar(toolbars[i]);
        toolbar.init();
    }
});