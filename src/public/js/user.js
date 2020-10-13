var User = function () {
    this.username = "unknown";
    this.loginButton = null;
    this.loginInput = null;
}

User.prototype.init() {

}

const saveButton = document.getElementById('saveButton');
saveButton.onclick = function() {
    document.querySelector('.bg-modal').style.display = "flex";
};

const submitSaveButton = document.getElementById('submitSaveButton');
submitSaveButton.onclick = function() {
    document.querySelector('.bg-modal').style.display = "none";
    socket.emit('save', document.getElementById('submitSaveInput').value);
};

window.addEventListener('load', function () {
    //var user = document.querySelector('.user');
    var user = new User();
    user.init();
});