FormatToolbarItem = function (domNode, toolbar) {
    this.domNode = domNode;
    this.toolbar = toolbar;
    this.buttonAction = '';
    this.value = '';
    this.popupLabelNode = null;
    this.hasHover = false;
    this.popupLabelDelay = 800;
};

FormatToolbarItem.prototype.init = function () {
    this.domNode.addEventListener('click', this.handleClick.bind(this));
    this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
    this.domNode.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

    if (this.domNode.classList.contains('bold')) {
        this.buttonAction = 'bold';
    }
    if (this.domNode.classList.contains('italic')) {
        this.buttonAction = 'italic';
    }
    if (this.domNode.classList.contains('underline')) {
        this.buttonAction = 'underline';
    }
    if (this.domNode.classList.contains('align-left')) {
        this.buttonAction = 'align';
        this.value = 'left';
        this.toolbar.alignItems.push(this);
    }
    if (this.domNode.classList.contains('align-center')) {
        this.buttonAction = 'align';
        this.value = 'center';
        this.toolbar.alignItems.push(this);
    }
    if (this.domNode.classList.contains('align-right')) {
        this.buttonAction = 'align';
        this.value = 'right';
        this.toolbar.alignItems.push(this);
    }
    if (this.domNode.classList.contains('spinbutton')) {
        this.buttonAction = 'changeFontSize';
    }

    this.popupLabelNode = this.domNode.querySelector('.popup-label');
    if (this.popupLabelNode) {
        var width = 8 * this.popupLabelNode.textContent.length;
        this.popupLabelNode.style.width = width + 'px';
        this.popupLabelNode.style.left = -1 * ((width - this.domNode.offsetWidth) / 2) - 5 + 'px';
    }
};

FormatToolbarItem.prototype.isPressed = function () {
    return this.domNode.getAttribute('aria-pressed')  === 'true';
};

FormatToolbarItem.prototype.setPressed = function () {
    this.domNode.setAttribute('aria-pressed', 'true');
};

FormatToolbarItem.prototype.resetPressed = function () {
    this.domNode.setAttribute('aria-pressed', 'false');
};

FormatToolbarItem.prototype.setChecked = function () {
    this.domNode.setAttribute('aria-checked', 'true');
    this.domNode.checked = true;
};

FormatToolbarItem.prototype.resetChecked = function () {
    this.domNode.setAttribute('aria-checked', 'false');
    this.domNode.checked = false;
};

FormatToolbarItem.prototype.disable = function () {
    this.domNode.setAttribute('aria-disabled', 'true');
};

FormatToolbarItem.prototype.enable = function () {
    this.domNode.removeAttribute('aria-disabled');
};

FormatToolbarItem.prototype.showPopupLabel = function () {
    if (this.popupLabelNode) {
        this.toolbar.hidePopupLabels();
        this.popupLabelNode.classList.add('show');
    }
};

FormatToolbarItem.prototype.hidePopupLabel = function () {
    if (this.popupLabelNode && !this.hasHover) {
        this.popupLabelNode.classList.remove('show');
    }
};

FormatToolbarItem.prototype.handleMouseLeave = function (event) {
    this.hasHover = false;
    setTimeout(this.hidePopupLabel.bind(this), this.popupLabelDelay);
};

FormatToolbarItem.prototype.handleMouseOver = function (event) {
    this.showPopupLabel();
    this.hasHover = true;
};

FormatToolbarItem.prototype.handleClick = function (e) {
    if (this.buttonAction == 'link')
        return;
    this.toolbar.setFocusItem(this);
    this.toolbar.activateItem(this);
};