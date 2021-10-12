import React from 'react';
import mestoLogo from './../images/mesto-logo.svg';
import { Switch, Route, Link } from 'react-router-dom';

function Header({ email, signOut }) {
  return (
    <header className="header">
      <img src={mestoLogo} alt="Логотип Mesto Russia" className="header__logo" />
      <div className="header__info">
        <Switch>
          <Route exact path = "/">
            <p className="header__email">{email}</p>
            <Link to="/sign-in" onClick={signOut} className="header__button">Выйти</Link>
          </Route>
          <Route path = "/sign-in">
            <Link to="/sign-up" className="header__button">Регистрация</Link>
          </Route>
          <Route path="/sign-up">
            <Link to="/sign-in" className="header__button">Войти</Link>
          </Route>
        </Switch>
      </div>
    </header>
  );
}

export default Header;
