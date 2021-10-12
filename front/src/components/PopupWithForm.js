import React from 'react';

function PopupWithForm({ title, name, buttonText, children, isOpen, onClose, onSubmit }) {
  return (
    <div className={`popup popup_type_${name} ${isOpen && 'popup_opened'}`}>
      <div className="popup__container">
        <button type="button" aria-label="Закрыть попап" onClick={onClose} className={`popup__close-button popup__close-button_type_${name}`}></button>
        <h2 className="popup__title">{title}</h2>
        <form name={`popup-form-${name}`} onSubmit={onSubmit} className={`popup__form popup__form_type_${name}`}>
          {children}
          <button type="submit" className="popup__submit-button">{buttonText}</button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
