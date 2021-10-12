import React from 'react';

function ImagePopup(props) {
  const { card, onClose } = props;

  return (
    <div className={`popup popup_type_image ${card.name && 'popup_opened'}`}>
      <figure className="popup__figure">
        <button type="button" aria-label="Закрыть попап" onClick={onClose} className="popup__close-button popup__close-button_type_image"></button>
        <img src={card.link} alt={card.name} className="popup__image" />
        <figcaption className="popup__figcaption">{card.name}</figcaption>
      </figure>
    </div>
  );
}

export default ImagePopup;
