import React from 'react';
import avatarButton from './../images/profile-avatar-button.svg';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({ cards, onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardDelete, onCardLike }) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="main">
      <section className="profile">
        <div className="profile__avatar-container">
          <div style={{ backgroundImage: `url(${currentUser.avatar})` }} className="profile__avatar" />
          <img src={avatarButton} alt="Иконка редактирования аватара" onClick={onEditAvatar} className="profile__avatar-edit" />
        </div>
        <div className="profile__info">
          <div className="profile__biography">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button type="button" aria-label="Редактировать профиль" onClick={onEditProfile} className="profile__edit-button"></button>
          </div>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button type="button" aria-label="Добавить фотографию" onClick={onAddPlace} className="profile__add-button"></button>
      </section>
      <section className="elements">
        {cards.map(card => <Card card={card} key={card._id} onCardClick={onCardClick} onCardDelete={onCardDelete} onCardLike={onCardLike} />)}
      </section>
    </main>
  );
}

export default Main;
