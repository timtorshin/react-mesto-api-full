import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const currentUser = React.useContext(CurrentUserContext);

  const [avatar, setAvatar] = React.useState('');

  function handleChangeAvatar(evt) {
    setAvatar(evt.target.value);
  }

  React.useEffect(() => {
    setAvatar(currentUser.avatar);
  }, [currentUser]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onUpdateAvatar({
      avatar,
    });
  }

  return (
    <PopupWithForm name='avatar' title='Обновить аватар' buttonText='Сохранить' isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <input type="url" onChange={handleChangeAvatar} className="popup__input popup__input_type_link" id="profile-avatar" name="link" placeholder="Ссылка на картинку" required />
      <span className="popup__input-error popup__input-error_type_link" id="profile-avatar-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
