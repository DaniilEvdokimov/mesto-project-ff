export function putLike(
  likeButton,
  item,
  likeCounter,
  deleteLikeCard,
  addLikeCard
) {
  if (likeButton.classList.contains("card__like-button_is-active")) {
    deleteLikeCard(item._id)
      .then((res) => {
        likeCounter.textContent = res.likes.length;
        likeButton.classList.remove("card__like-button_is-active");
      })
      .catch((err) => {
        console.error("Произошла ошибка при удалении лайка:", err);
      });
  } else {
    addLikeCard(item._id)
      .then((res) => {
        likeButton.classList.add("card__like-button_is-active");
        likeCounter.textContent = res.likes.length;
      })
      .catch((err) => {
        console.error("Произошла ошибка при добавлении лайка:", err);
      });
  }
}

export function createCard(item, callbacksObject, userId) {
  const {
    openImageCallback,
    likeCallback,
    openDeletePopupCallBack,
    deleteLikeCard,
    addLikeCard,
  } = callbacksObject;

  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeCounter = cardElement.querySelector(".card__like-counter");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardTitle.textContent = item.name;
  cardImage.src = item.link;
  cardImage.alt = item.name;
  likeCounter.textContent = item.likes.length;

  let isLike = item.likes.some((likeItem) => likeItem._id === userId);

  if (isLike) {
    likeButton.classList.add("card__like-button_is-active");
  } else {
    likeButton.classList.remove("card__like-button_is-active");
  }

  // basket
  cardDeleteButton.style.display = item.owner._id === userId ? "block" : "none";

  // Слушатель удаления карточки
  cardDeleteButton.addEventListener("click", () => {
    openDeletePopupCallBack(cardElement, item._id);
  });

  // Слушатель лайка
  likeButton.addEventListener("click", () => {
    likeCallback(likeButton, item, likeCounter, deleteLikeCard, addLikeCard);
  });

  // Слушатель добавления картинки
  cardImage.addEventListener("click", () => {
    openImageCallback(item.name, item.link);
  });
  return cardElement;
}
