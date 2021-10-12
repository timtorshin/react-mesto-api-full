import React from 'react';
import { Link } from 'react-router-dom';

function Register({ registration }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleChangeEmail(evt) {
    setEmail(evt.target.value);
  }

  function handleChangePassword(evt) {
    setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    registration(email, password);
  }

  return (
    <div className="sign">
      <h2 className="sign__title">Регистрация</h2>
      <form onSubmit={handleSubmit} className="sign__form">
        <input type="email" placeholder="Email" value={email} onChange={handleChangeEmail} className="sign__input"></input>
        <input type="password" placeholder="Пароль" value={password} onChange={handleChangePassword} className="sign__input"></input>
        <button type="submit" className="sign__button">Зарегистрироваться</button>
      </form>
      <Link to="/sign-in" className="sign__link">Уже зарегистрированы? Войти</Link>
    </div>
  );
}

export default Register;
