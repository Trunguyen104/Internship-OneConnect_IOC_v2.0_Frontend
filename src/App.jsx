import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './features/auth/LoginForm';
import RegisterForm from './features/auth/RegisterForm';
import ForgotPassword from './features/auth/ForgotPassword';

function App() {

  return (
    <>
      <Routes>
        <Route index element={<LoginForm />}></Route>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route path="/register" element={<RegisterForm />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      </Routes>
    </>
  );
}

export default App;
