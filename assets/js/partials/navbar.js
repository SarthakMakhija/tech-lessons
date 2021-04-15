document.addEventListener("DOMContentLoaded", function (event) {

  /*
   * Display the menu items on smaller screens
   */
  var pull = document.getElementById('pull');
  var menu = document.querySelector('nav ul');


  ['click', 'touch'].forEach(function (e) {
    pull.addEventListener(e, function (e) {
      menu.classList.toggle('hide')
    }, false);
  });
});
