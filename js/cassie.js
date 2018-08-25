// cassie.js
// Copyright 2017-2018 Cassie Peele
// http://www.opensource.org/licenses/mit-license.php

var modal;
// var modalBodies;
// var modalHeads;
var modalElements;

document.addEventListener("DOMContentLoaded", function(event) {
  init();
}, false);

function init() {
  // Assign vars
  modal = document.getElementById("modal");
  // modalBodies = document.getElementsByClassName("modal-body");
  // modalHeads = document.getElementsByClassName("modal-head");
  modalElements = [
    document.getElementById("head-plat"),
    document.getElementById("head-girl"),
    document.getElementById("head-zero"),
    document.getElementById("head-pong"),
    document.getElementById("head-math"),
    document.getElementById("head-pets"),
    document.getElementById("info-plat"),
    document.getElementById("info-girl"),
    document.getElementById("info-zero"),
    document.getElementById("info-pong"),
    document.getElementById("info-math"),
    document.getElementById("info-pets"),
    modal
  ];

  // Allow opening modal
  document.getElementById("row-plat").addEventListener("click", function() {openModal("plat");}, false);
  document.getElementById("row-girl").addEventListener("click", function() {openModal("girl");}, false);
  document.getElementById("row-zero").addEventListener("click", function() {openModal("zero");}, false);
  document.getElementById("row-pong").addEventListener("click", function() {openModal("pong");}, false);
  document.getElementById("row-math").addEventListener("click", function() {openModal("math");}, false);
  document.getElementById("row-pets").addEventListener("click", function() {openModal("pets");}, false);

  // Allow closing modal
  document.getElementById("close").addEventListener("click", closeModal, false);
  window.addEventListener("click", function() {
    if (event.target == modal) {
      closeModal();
    }
  }, false);
  window.addEventListener("keydown", function() {
    if (event.key == "Esc" || event.key == "Escape") {
      closeModal();
    }
  }, false);
  closeModal();
}

function openModal(game) {
  // modal.style.display = "block";
  // // document.getElementById("head-" + game).style.display = "block";
  // // document.getElementById("info-" + game).style.display = "block";
  var head = document.getElementById("head-" + game);
  var info = document.getElementById("info-" + game);
  modal.classList.remove("u-hidden");
  head.classList.remove("u-hidden");
  info.classList.remove("u-hidden");
  modal.hidden = false;
  head.hidden = false;
  info.hidden = false;
}

function closeModal() {
  // modal.style.display = "none";
  // for (var modalBody of modalBodies) {
  //   // modalBody.style.display = "none";
  //   modalBody.classList.add("u-hidden");
  //   modalBody.hidden = true;
  // }
  // for (var modalHead of modalHeads) {
  //   // modalHead.style.display = "none";
  //   modalHead.classList.add("u-hidden");
  //   modalHead.hidden = true;
  // }
  for (element of modalElements) {
    element.classList.add("u-hidden");
    element.hidden = true;
  }
}
