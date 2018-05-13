/*
@description - Takes the input from the search bar, and automaically returns
  the local site appended with /input
@author - Brandon - Brandon.Murch@protonmail.com
*/

window.onload = function() {
  //reset form on reload
  let searchBarForm: HTMLFormElement = document.getElementsByClassName('searchBar--form')[0] as HTMLFormElement;
  searchBarForm.reset();
  let submitButton: HTMLElement = document.getElementsByClassName('btn--submit')[0] as HTMLElement;
  submitButton.onclick = () => {
    let searchBar: HTMLInputElement = document.getElementsByClassName('searchBar')[0] as HTMLInputElement;
    window.location.href = '\/L\/' + searchBar.value; // redirects to ./L/link. Need /L/ for website to realize your searching for a link.  
  };
  document.onkeydown = function(event) {
    //when enter is pressed, it submits
    if (event.keyCode == 13) {
      event.preventDefault()
      let submitButton: HTMLElement = document.getElementsByClassName('btn--submit')[0] as HTMLElement;
      submitButton.click();
    }
  };
};
