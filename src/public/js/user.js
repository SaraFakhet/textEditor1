var User = function () {
    this.username = "";
}

User.prototype.init = function () {
    document.getElementById('loginButton').addEventListener("click", () => {
        document.querySelector('.bg-modal-login').style.display = "none";
        this.username = document.getElementById('loginInput').value;
    })
}