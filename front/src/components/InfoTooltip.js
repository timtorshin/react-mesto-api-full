import React from 'react';

function InfoTooltip({ isOpen, onClose, infoPopupCondition }) {
  return (
    <div className={`popup popup_type_info ${isOpen && 'popup_opened'}`}>
      <div className="popup__container">
        <button type="button" aria-label="Закрыть попап" onClick={onClose} className="popup__close-button"></button>
        <div className="popup__sign-info">
          <img src={infoPopupCondition.path} alt="" className="popup__sign-logo" />
          <h2 className="popup__sign-caption">{infoPopupCondition.text}</h2>
        </div>
      </div>
    </div>
  );
}

export default InfoTooltip;
