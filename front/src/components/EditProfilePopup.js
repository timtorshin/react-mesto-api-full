import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  function handleChangeName(evt) {
    setName(evt.target.value);
  }

  function handleChangeDescription(evt) {
    setDescription(evt.target.value);
  }

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm name='edit' title='Редактировать профиль' buttonText='Сохранить' isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <input type="text" onChange={handleChangeName} value={name || ''} className="popup__input popup__input_type_name" id="profile-name" name="name" minLength="2" maxLength="40" placeholder="Имя" required />
      <span className="popup__input-error popup__input-error_type_name" id="profile-name-error"></span>
      <input type="text" onChange={handleChangeDescription} value={description || ''} className="popup__input popup__input_type_description" id="profile-description" name="about" minLength="2" maxLength="200" placeholder="О себе" required />
      <span className="popup__input-error popup__input-error_type_description" id="profile-description-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
