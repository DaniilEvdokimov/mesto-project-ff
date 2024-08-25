//закрытие на крестик
function closePopupByCross(evt) {
  const button = evt.target;
  const popup = button.closest(".popup");
  closePopup(popup);
}
//закрыть попап по Escape
function closePopupByEscape(event) {
  if (event.key === "Escape") {
    closePopup(document.querySelector(".popup_is-opened"));
  }
}
//закрыть попап щелчком на оверлее
function closePopupOverlay(evt) {
  if (evt.target.classList.contains("popup_is-opened")) {
    closePopup(evt.target);
  }
}
function closePopup(element) {
  element.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closePopupByEscape);
  document.removeEventListener("click", closePopupOverlay);
  const popupCloseButton = element.querySelector(".popup__close");
  popupCloseButton.removeEventListener("click", closePopupByCross);
}
function openPopup(element) {
  element.classList.add("popup_is-opened");
  document.addEventListener("keydown", closePopupByEscape);
  document.addEventListener("click", closePopupOverlay);
  const popupCloseButton = element.querySelector(".popup__close");
  popupCloseButton.addEventListener("click", closePopupByCross);
}
export { openPopup, closePopup };
