var User = function () {
    this.username = "anonyme";
}

User.prototype.init = function () {
    document.getElementById('loginButton').addEventListener("click", () => {
        document.querySelector('.bg-modal-login').style.display = "none";
        var username = document.getElementById('loginInput').value;
        if (username) {
            this.username = username;
        }
        document.getElementById('username').innerHTML = this.username;
    })
}