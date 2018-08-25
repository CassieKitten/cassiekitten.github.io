// cassie.js
// Copyright 2017-2018 Cassie Peele
// http://www.opensource.org/licenses/mit-license.php

var modal;
var modalBodies;
var modalHeads;

document.addEventListener("DOMContentLoaded", function(event) {
  init();
}, false);

function init() {
  // Assign vars
  modal = document.getElementById("modal");
  modalBodies = document.getElementsByClassName("modal-body");
  modalHeads = document.getElementsByClassName("modal-head");

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
  modal.style.display = "block";
  // document.getElementById("head-" + game).style.display = "block";
  // document.getElementById("info-" + game).style.display = "block";
  var head = document.getElementById("head-" + game);
  var info = document.getElementById("info-" + game);
  head.classList.remove("hidden");
  info.classList.remove("hidden");
  head.hidden = false;
  info.hidden = false;
}

function closeModal() {
  modal.style.display = "none";
  for (var modalBody of modalBodies) {
    // modalBody.style.display = "none";
    modalBody.classList.add("hidden");
    modalBody.hidden = true;
  }
  for (var modalHead of modalHeads) {
    // modalHead.style.display = "none";
    modalHead.classList.add("hidden");
    modalHead.hidden = true;
  }
}
