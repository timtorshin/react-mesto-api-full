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
    if (isLoggedIn) {
      api.getUserData(localStorage.jwt)
        .then((data) => {
          setCurrentUser(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isLoggedIn]);

  React.useEffect(() => {
    if (isLoggedIn) {
      api.getInitialCards(localStorage.jwt)
        .then((cards) => {
          console.log(cards);
          setCards(cards.reverse());
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isLoggedIn]);

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

  function handleUpdateUser(data) {
    api.editProfileInfo(data, localStorage.jwt)
      .then((res) => {
        setCurrentUser({name: res.name, about: res.about, avatar: res.avatar});
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(link) {
    api.updateAvatar(link, localStorage.jwt)
      .then((data) => {
        setCurrentUser({name: data.name, about: data.about, avatar: data.avatar});
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(data) {
    api.addNewCard(data, localStorage.jwt)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
  }

  function handleCardDelete(card) {
    api.removeCard(card._id, localStorage.jwt)
      .then(() => {
        setCards(cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked, localStorage.jwt)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
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
            setEmailValue(res.email);
          }
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem('jwt');
        });
    }
  }, [history]);

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
