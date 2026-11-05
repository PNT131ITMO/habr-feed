
import { useState } from "react";

export default function AuthForm({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (isRegister && !name.trim()) {
      setError("Введите имя пользователя.");
      return;
    }

    if (!email.includes("@")) {
      setError("Введите корректный email.");
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен содержать не менее 8 символов.");
      return;
    }

    const handler = isRegister ? onRegister : onLogin;

    if (typeof handler !== "function") {
      setError("API авторизации пока не подключён.");
      return;
    }

    try {
      setLoading(true);
      await handler({
        email,
        password,
        ...(isRegister ? { name: name.trim() } : {}),
      });
    } catch (err) {
      setError(err.message || "Ошибка авторизации.");
    } finally {
      setLoading(false);
    }
  }

  function changeMode() {
    setMode(isRegister ? "login" : "register");
    setError("");
    setPassword("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isRegister ? "Регистрация" : "Вход"}</h2>

      {isRegister && (
        <label>
          Имя пользователя
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
      )}

      <label>
        Электронная почта
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <label>
        Пароль
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={
            isRegister ? "new-password" : "current-password"
          }
          minLength={8}
          required
        />
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading
          ? "Загрузка..."
          : isRegister
            ? "Зарегистрироваться"
            : "Войти"}
      </button>

      <button type="button" onClick={changeMode}>
        {isRegister
          ? "Уже есть аккаунт? Войти"
          : "Создать аккаунт"}
      </button>
    </form>
  );
}
