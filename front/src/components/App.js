import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/api';
import InfoTooltip from './InfoTooltip';
import Register from './Register';
import Login from './Login';
import * as auth from '../utils/auth';
import ProtectedRoute from './ProtectedRoute';
import successfulIcon from '../images/successful-icon.svg';
import unsuccessfulIcon from '../images/unsuccessful-icon.svg';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

function App() {
  const [currentUser, setCurrentUser] = React.useState({});
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({ name: '', link: '' });
  const [cards, setCards] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [emailValue, setEmailValue] = React.useState('');
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [infoPopupCondition, setInfoPopupCondition] = React.useState({ path: '', text: '' });
  const history = useHistory();

  React.useEffect(() => {
    api.getUserData()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    api.getInitialCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    function handleEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  React.useEffect(() => {
    function handleOverlayClick(evt) {
      if (evt.target.classList.contains('popup_opened')) {
        closeAllPopups();
      }
    }
    document.addEventListener('click', handleOverlayClick);
    return () => {
      document.removeEventListener('click', handleOverlayClick);
    };
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(selectedCard) {
    setSelectedCard({ name: selectedCard.name, link: selectedCard.link });
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({ name: '', link: '' });
  }

  function handleUpdateUser({ name, about }) {
    api.editProfileInfo(name, about)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api.updateAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(card) {
    api.addNewCard(card.name, card.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
  }

  function handleCardDelete(card) {
    api.removeCard(card._id)
      .then(() => {
      setCards(cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    const changeLikeCardStatus = isLiked ? api.deleteLike(card._id) : api.putLike(card._id);
    changeLikeCardStatus.then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err) => {
      console.log(err);
    });
  }

  React.useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.getContent(jwt)
        .then((res) => {
          if (res) {
            setIsLoggedIn(true);
            history.push('/');
            setEmailValue(res.data.email);
          }
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem('jwt');
        });
    }
  }, [isLoggedIn, history]);

  function registration(email, password) {
    auth.register(email, password)
      .then(() => {
        changeInfoTooltip({
          path: successfulIcon,
          text: 'Вы успешно зарегистрировались!',
        });
        handleInfoTooltipOpen();
      })
      .catch(() => {
        changeInfoTooltip({
          path: unsuccessfulIcon,
          text: 'Что-то пошло не так! Попробуйте ещё раз.',
        });
      })
      .finally(() => {
        handleInfoTooltipOpen();
      });
  }

  function authorization(email, password) {
    auth.authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setIsLoggedIn(true);
          history.push('/');
          setEmailValue(email);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function signOut() {
    localStorage.removeItem('jwt');
    history.push('/sign-in');
  }

  function changeInfoTooltip({ path, text }) {
    setInfoPopupCondition({
      path: path,
      text: text,
    });
  }

  function handleInfoTooltipOpen() {
   setIsInfoTooltipOpen(true);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Header
          email={emailValue}
          signOut={signOut}
        />
        <Switch>
          <ProtectedRoute
            exact path="/"
            isLoggedIn={isLoggedIn}
            component={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardDelete={handleCardDelete}
            onCardLike={handleCardLike}
            cards={cards}
          />
          <Route path="/sign-in">
            <Login authorization={authorization} />
          </Route>
          <Route path="/sign-up">
            <Register registration={registration} />
          </Route>
          <Route path="/">
            { isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" /> }
          </Route>
        </Switch>
        <Footer />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          infoPopupCondition={infoPopupCondition}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
