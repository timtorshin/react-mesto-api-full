import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = card.owner === currentUser._id;
  const cardDeleteButtonClassName = (`element__delete-button ${isOwn ? 'element__delete-button_visible' : 'element__delete-button_hidden'}`);

  const isLiked = card.likes.some((i) => i === currentUser._id);
  const cardLikeButtonClassName = `element__like-button ${isLiked ? 'element__like-button_active' : ''}`;

  function handleClick() {
    onCardClick(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  return (
    <article key={card._id} className="element">
      <img src={card.link} alt={card.name} name="name" onClick={handleClick} className="element__image" />
      <div className="element__caption">
        <h2 name="link" className="element__title">{card.name}</h2>
        <div className="element__like-container">
          <button type="button" aria-label="Поставить лайк" onClick={handleLikeClick} className={cardLikeButtonClassName}></button>
          <p className="element__like-counter">{card.likes.length}</p>
        </div>
      </div>
      <button type="button" aria-label="Удалить фотографию" onClick={handleDeleteClick} className={cardDeleteButtonClassName}></button>
    </article>
  );
}

export default Card;
