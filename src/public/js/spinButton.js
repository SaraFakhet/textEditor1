// Create SpinButton that contains value, valuemin, valuemax, and valuenow
var SpinButton = function (domNode, toolbar)  {
    this.domNode = domNode;
    this.toolbar = toolbar;
    this.valueDomNode = domNode.querySelector('.value');
    this.increaseDomNode = domNode.querySelector('.increase');
    this.decreaseDomNode = domNode.querySelector('.decrease');
    this.valueMin  = 8;
    this.valueMax  = 40;
    this.valueNow  = 12;
    this.valueText = this.valueNow + ' pt';
};

// Initialize slider
SpinButton.prototype.init = function () {

    if (this.domNode.getAttribute('aria-valuemin')) {
        this.valueMin = parseInt((this.domNode.getAttribute('aria-valuemin')));
    }
    if (this.domNode.getAttribute('aria-valuemax')) {
        this.valueMax = parseInt((this.domNode.getAttribute('aria-valuemax')));
    }
    if (this.domNode.getAttribute('aria-valuenow')) {
        this.valueNow = parseInt((this.domNode.getAttribute('aria-valuenow')));
    }

    this.setValue(this.valueNow);
    this.increaseDomNode.addEventListener('click', this.handleIncreaseClick.bind(this));
    this.decreaseDomNode.addEventListener('click', this.handleDecreaseClick.bind(this));
	
		
	socket.on('fontSize', (value) => {
		this.setValue(value);
	})

};

SpinButton.prototype.setValue = function (value) {
    if (value > this.valueMax) {
        value = this.valueMax;
    }
    if (value < this.valueMin) {
        value = this.valueMin;
    }

    this.valueNow  = value;
    this.valueText = value + ' pt';

    if (this.valueDomNode) {
        this.valueDomNode.innerHTML = this.valueText;
    }
    this.toolbar.changeFontSize(value);
};

SpinButton.prototype.handleIncreaseClick = function (event) {
    this.setValue(this.valueNow + 1);
    event.preventDefault();
    event.stopPropagation();
	socket.emit('fontSize', this.valueNow);
};

SpinButton.prototype.handleDecreaseClick = function (event) {
    this.setValue(this.valueNow - 1);
    event.preventDefault();
    event.stopPropagation();
	socket.emit('fontSize', this.valueNow);
};