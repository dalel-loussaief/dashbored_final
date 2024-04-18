import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Ajout de l'état pour le rôle
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem('storedEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }

    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    const handleRegisterClick = () => {
      container.classList.add("active");
    };

    const handleLoginClick = () => {
      container.classList.remove("active");
    };

    registerBtn.addEventListener('click', handleRegisterClick);
    loginBtn.addEventListener('click', handleLoginClick);

    return () => {
      registerBtn.removeEventListener('click', handleRegisterClick);
      loginBtn.removeEventListener('click', handleLoginClick);
    };
  }, []);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    localStorage.setItem('storedEmail', e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    // Vérifier si tous les champs sont remplis
    if (!name || !email || !password || !phone || !role) {
      toast.error("Please fill in all the fields");
      return;
    }
  
    let role_id;
    // Assigner une valeur à role_id en fonction du rôle sélectionné
    if (role === "agent") {
      role_id = 2;
    } else if (role === "user") {
      role_id = 3;
    }
  
    try {
      // Envoyer les données au backend Django
      const response = await axios.post("http://localhost:8000/userAuth/api/register", {
        name: name,
        email: email,
        password: password,
        phone: phone,
        role_id: role_id
      });
  
      if (response.status === 200) {
        toast.success("Your account is created");
  
        // Redirection en fonction du rôle
        if (role === "agent") {
          window.location.href = "http://localhost:5174/";
        } else if (role === "admin") {
          window.location.href = "http://localhost:5173/";
        } else if (role === "user") {
          window.location.href = "http://localhost:3000/";
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    }
  };
  
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/userAuth/api/login', {
        email: email,
        password: password
      });
      // Si la requête réussit, vous pouvez traiter la réponse ici
      const token = response.data.token;
      // Stockez le token JWT dans le stockage local du navigateur
      localStorage.setItem('token', token);
      const userRole = response.data.role; // Correction: 'res' à 'response'
      if (userRole === 'agent') {
        localStorage.setItem('userRole', userRole);
        window.location.href = "http://localhost:5174/";
      } else if (userRole === 'admin') { // Correction: 'else if' au lieu de 'else if(userRole === 'admin')'
        window.location.href = "http://localhost:5173/";
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="container" id="container">
      <div className="form-container sign-up">
        <form>
          <h1>Create Account</h1>
          <input type="text" placeholder="name" onChange={(e) => setName(e.target.value)} value={name} />
          <input type="email" placeholder="email" onChange={handleEmail} value={email} />
          <input type="password" placeholder="password" onChange={handlePassword} value={password} />
          <input type="text" placeholder="phone" onChange={(e) => setPhone(e.target.value)} value={phone} />
          <select
                id="role"
                name="role"
                className="mt-1 p-2 w-full text-black block rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="agent">Agent</option>
                <option value="user">User</option>
              </select>
          <button onClick={handleSignIn}>Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in">
        <form>
          <h1>Login In</h1>
          <span>or use your email password</span>
          <input type="email" placeholder="email" onChange={handleEmail} value={email} />
          <input type="password" placeholder="password" onChange={handlePassword} value={password} />
          <button onClick={handleLogin}>Login In</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className="hidden" id="login">Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h2>Welcome to Mart Villa</h2>
            <p>Register with your personal details to use all of site features</p>
            <button className="hidden" id="register">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
