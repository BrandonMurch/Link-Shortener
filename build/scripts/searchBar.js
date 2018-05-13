window.onload = function () {
    let searchBarForm = document.getElementsByClassName('searchBar--form')[0];
    searchBarForm.reset();
    let submitButton = document.getElementsByClassName('btn--submit')[0];
    submitButton.onclick = () => {
        let searchBar = document.getElementsByClassName('searchBar')[0];
        window.location.href = '\/L\/' + searchBar.value;
    };
    document.onkeydown = function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            let submitButton = document.getElementsByClassName('btn--submit')[0];
            submitButton.click();
        }
    };
};
//# sourceMappingURL=searchBar.js.map