// cassie.js
// Copyright 2017 Cassie Peele
// http://www.opensource.org/licenses/mit-license.php

document.addEventListener("DOMContentLoaded", function(event) {
  init();
})

function init() {
  // Make <tr>s clickable
  var trs = document.getElementsByTagName("tr");
  for (var tr of trs) {
    if (tr.getAttribute("class") == "clickable") {
      tr.addEventListener("click", function() {
        var href = this.querySelector("a").getAttribute("href");
        if (href) {
          window.location.assign(href);
        }
      });
    }
  }
}
