export const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
  };

const showInputError = (formElement, inputElement, validationConfig) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add(validationConfig.inputErrorClass);
    errorElement.classList.add(validationConfig.errorClass);
    errorElement.textContent = inputElement.validationMessage;
  };

export const hideInputError = (formElement, inputElement, validationConfig) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(validationConfig.inputErrorClass);
    errorElement.classList.remove(validationConfig.errorClass);
    errorElement.textContent = "";
  };

  // Проверить, есть ли хотя бы одно невалидное поле
  const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  };

  function toggleButtonState (inputList, buttonElement, validationConfig) {
    if (hasInvalidInput(inputList, validationConfig)) {
      buttonElement.setAttribute("disabled", true);
      buttonElement.classList.add(validationConfig.inactiveButtonClass);
    } else {
      buttonElement.removeAttribute("disabled");
      buttonElement.classList.remove(validationConfig.inactiveButtonClass);
    }
  };

  function checkInputValidity (formElement, inputElement, validationConfig) {
    if (inputElement.validity.patternMismatch) {
      inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
      inputElement.setCustomValidity('');
    }
      if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, validationConfig);
    } else {
      hideInputError(formElement, inputElement, validationConfig);
    }
  };

  function setEventListeners (formElement, validationConfig) {
    const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
    const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
    inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', function () {
        checkInputValidity(formElement, inputElement, validationConfig);
        toggleButtonState(inputList, buttonElement, validationConfig);
      });
    });
  };

export  function enableValidation (validationConfig) {
    const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
    formList.forEach((formElement) => {
      formElement.addEventListener('submit', function (evt) {
        evt.preventDefault();
      });
      setEventListeners(formElement, validationConfig);
    });
  };

export  function clearValidation (formElement, validationConfig) {
    const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
    const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
    inputList.forEach((inputElement) =>
      hideInputError(formElement, inputElement, validationConfig)
    );
    toggleButtonState(inputList, buttonElement, validationConfig);
  };
