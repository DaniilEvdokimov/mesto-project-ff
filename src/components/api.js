export const config = {
  baseUrl: "https://nomoreparties.co/v1/cohort-magistr-2",
  headers: {
    authorization: "6931759b-d355-460b-833b-2fa728c72f7c", //myId
    "Content-Type": "application/json",
  },
};

export const getResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

// Получение карточки
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  })
  .then(getResponse)
  .then((data) => {
    return data;
  })
};

// Получить данные о пользователе
export const getUser = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  })
    .then(getResponse)
    .then((data) => {
      return data;
    })
};

// Удаление карточки по идентификатору
export const deleteCardId = (id) => {
  return fetch(`${config.baseUrl}/cards/` + `${id}`, {
    method: "DELETE",
    headers: config.headers,
  })
  .then(getResponse)
};

// Обновление информации о пользователе
export const patchUser = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  })
  .then(getResponse)
};

// Добавление новой карточки
export const postCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name,
      link,
    }),
  })
  .then(getResponse)
};

// Добавление лайка карточке
export const addLikeCard = (id) => {
  return fetch(`${config.baseUrl}/cards/likes/` + `${id}`, {
    method: "PUT",
    headers: config.headers,
  })
  .then(getResponse)
}


// Удаление лайка с карточки
export const deleteLikeCard = (id) => {
  return fetch(`${config.baseUrl}/cards/likes/` + `${id}`, {
    method: "DELETE",
    headers: config.headers,
  })
  .then(getResponse)
}

// Обновление аватара пользователя
export const patchAvatar = (avatar) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({ avatar: avatar }),
  })
  .then(getResponse)
};

// ux
const renderLoading = ({ buttonElement, isLoading }) => {
  if (isLoading) {
    buttonElement.textContent = "Сохранение...";
  } else {
    buttonElement.textContent = "Сохранить";
  }
};
