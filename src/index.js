import "./pages/index.css";
import { openPopup, closePopup } from "./components/modal.js";
import { createCard, putLike } from "./components/card.js";
import {
  enableValidation,
  clearValidation,
} from "./components/validation.js";
import { validationConfig } from "./components/validation-config"
import {
  getUser,
  getInitialCards,
  postCard,
  patchUser,
  deleteCardId,
  patchAvatar,
  deleteLikeCard,
  addLikeCard
} from "./components/api.js";

const placesList = document.querySelector(".places__list");

const popupEditElement = document.querySelector(".profile__edit-button");
const popupAddElement = document.querySelector(".profile__add-button");
const popupEditContent = document.querySelector(".popup_type_edit");
const popupAddContent = document.querySelector(".popup_type_new-card");

const popupImage = document.querySelector(".popup_type_image");
const popupImageCaption = popupImage.querySelector(".popup__caption");
const popupImagePicture = popupImage.querySelector(".popup__image");

const formCardElement = document.forms["new-place"];
const buttonSavePlace = formCardElement.querySelector(".popup__button");
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");

const formPersonElement = document.forms["edit-profile"];
const cardNameInput = document.querySelector(".popup__input_type_card-name");
const cardUrlInput = document.querySelector(".popup__input_type_url");
const buttonSaveProfile = formPersonElement.querySelector(".popup__button");


const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const avatarImageButton = document.querySelector(".profile__image");
const popupAvatar = document.querySelector(".popup_type_new-avatar");
const avatarInput = document.querySelector('input[name="link_avatar"]');


const formDeleteCard = document.forms["delete-card"];
const formDeleteCardButton = formDeleteCard.querySelector(".popup__button");
const popupDelete = document.querySelector(".popup_type_delete-card");

const formAvatarElement = document.forms["new-avatar"];
const buttonAvatarSave = formAvatarElement.querySelector(".popup__button");

let userId = "";

// Объект с callback'ами для работы с событиями карточек
const callbacksObject = {
  likeCallback: putLike,
  deleteCardCallback: deleteCard,
  openImageCallback: openImagePopup,
  openDeletePopupCallBack: openDeletePopup, // was openPopup,
  deleteLikeCard: deleteLikeCard,
  addLikeCard: addLikeCard,
}

// Открытие модального окна с изображением карточки
function openImagePopup(cardName, cardLink) {
  popupImagePicture.src = cardLink;
  popupImagePicture.alt = cardName;
  popupImageCaption.textContent = cardName;
  openPopup(popupImage);
}

// Удаление карточки по id
function deleteCard(cardElement, _id) {
  deleteCardId(_id)
    .then(() => {
      cardElement.remove();
      closePopup(popupDelete);
    })
    .catch((err) => {
      console.error("Ошибка при удалении карточки:", err);
    });
}

function openDeletePopup(cardElement, cardId) {
  formDeleteCardButton.cardElement = cardElement;
  formDeleteCardButton.cardId = cardId;
  openPopup(popupDelete);
}

// Слушатель подтверждения удаления карточки по id
formDeleteCardButton.addEventListener("click", () => {
  deleteCard(formDeleteCardButton.cardElement, formDeleteCardButton.cardId);
});

// Запрос на сервер данных Profile и отобразить их при загрузке страницы;
const updateProfileData = (data) => {
  profileTitle.textContent = data.name;
  profileDescription.textContent = data.about;
  userId = data._id;
  avatarImageButton.style.backgroundImage = `url(${data.avatar})`;
}

// Изменение имени и описания профиля
function changeProfileFormSubmit(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
  const currentName = profileTitle.textContent;
  const currentAbout = profileDescription.textContent
  loading(buttonSaveProfile, true);
  const name = (profileTitle.textContent = nameInput.value);
  const about = (profileDescription.textContent = jobInput.value);
  patchUser(name, about)
    .then((dataUser) => {
      // Обновление отображаемых данных профиля на странице
      profileTitle.textContent = dataUser.name;
      profileDescription.textContent = dataUser.about;
      closePopup(popupEditContent);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
      profileTitle.textContent = currentName;
      profileDescription.textContent = currentAbout;
    })
    .finally(() => {
      loading(buttonSaveProfile, false);
    });
}

// Добавления новой карточки по ссылке
function addCardFormSubmit(evt) {
  evt.preventDefault();
  loading(buttonSavePlace, true);
  const cardNameValue = cardNameInput.value;
  const cardUrlValue = cardUrlInput.value;
  //отправить на сервер и вернуть данные карточки
  postCard(cardNameValue, cardUrlValue)
    .then((dataCard) => {
      placesList.prepend(createCard(dataCard, callbacksObject, userId));
      closePopup(popupAddContent);
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки:", err);
    })
    .finally(() => {
      loading(buttonSavePlace, false);
    });
}

// Вывод карточек с бэка
const renderCards = (dataCards) => {
  dataCards.forEach((item) => {
    placesList.append(createCard(item, callbacksObject, userId));
  });
}

// Слушатель - изменение описания профиля
formPersonElement.addEventListener("submit", function (evt) {
  changeProfileFormSubmit(evt);
});

// Слушатель - добавление карточки по ссылке
formCardElement.addEventListener("submit", addCardFormSubmit);

// Слушатель - открыть popup "Редактировать профиль"
popupEditElement.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(popupEditContent, validationConfig);
  openPopup(popupEditContent);
});

// Слушатель - открыть popup "Новое место"
popupAddElement.addEventListener("click", () => {
  cardNameInput.value = "";
  cardUrlInput.value = "";
  clearValidation(popupAddContent, validationConfig);
  openPopup(popupAddContent);
});

//UX
const loading = (button, isLoading) => {
  button.textContent = isLoading ? "Сохранение..." : "Сохранить";
}

// Слушатель - открыть popup "Смена аватара"
avatarImageButton.addEventListener("click", () => {
  avatarInput.value = "";
  clearValidation(popupAvatar, validationConfig);
  openPopup(popupAvatar);
});

// Слушатель - изменение аватара
formAvatarElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  loading(buttonAvatarSave, true);
  const avatar = avatarInput.value;
  const currentAvatar = avatarImageButton.style.backgroundImage;
  patchAvatar(avatar)
    .then((data) => {
      avatarImageButton.style.backgroundImage = `url(${data.avatar})`;
      closePopup(popupAvatar);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении аватара:", err);
      avatarImageButton.style.backgroundImage = currentAvatar;
    })
    .finally(() => {
      loading(buttonAvatarSave, false);
    });
});

Promise.all([getUser(), getInitialCards()])
    .then(([user, cards]) => {
      const userId = user._id;
      updateProfileData(user);
      renderCards(cards, callbacksObject, user._id);
    })
    .catch((err) => {
      console.error("Произошла ошибка при получении данных:", err);
    });

enableValidation(validationConfig);
