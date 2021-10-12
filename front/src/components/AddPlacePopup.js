import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const cardNameRef = React.useRef();
  const cardLinkRef = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    onAddPlace({
      name: cardNameRef.current.value,
      link: cardLinkRef.current.value,
    });
  }

  return (
    <PopupWithForm name='add' title='Новое место' buttonText='Создать' isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <input type="text" ref={cardNameRef} className="popup__input popup__input_type_title" id="element-title" name="name" minLength="2" maxLength="30" placeholder="Название" required />
      <span className="popup__input-error popup__input-error_type_title" id="element-title-error"></span>
      <input type="url" ref={cardLinkRef} className="popup__input popup__input_type_link" id="element-link" name="link" placeholder="Ссылка на картинку" required />
      <span className="popup__input-error popup__input-error_type_link" id="element-link-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
