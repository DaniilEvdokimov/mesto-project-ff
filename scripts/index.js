import { initialCards } from './cards.js';

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const cardsContainer = document.querySelector('.places__list')

// Функция создания карточки
const createCard = (name, link, onDeleteCard) => {
    const cardElement = cardTemplate.querySelector('.places__item.card').cloneNode(true);

    cardElement.querySelector('.card__image').src = link;
    cardElement.querySelector('.card__title').textContent = name;

    const deleteButton = cardElement.querySelector('.card__delete-button')
    deleteButton.addEventListener("click", onDeleteCard);

    return cardElement
}

// Функция удаления карточки
const handleDeleteCard = (evt) => {
    evt.target.closest(".card").remove();
};

// Вывод карточек на страницу
initialCards.forEach(card => {
    const cardElement = createCard(card.name, card.link, handleDeleteCard);
    cardsContainer.appendChild(cardElement);
});