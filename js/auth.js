// auth.js - simple localStorage-based auth for demo
function initAuth(){
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const msg = document.getElementById('auth-msg');

  if(signupForm){
    signupForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim().toLowerCase();
      const pass = document.getElementById('signup-pass').value;
      if(!name || !email || !pass) { showMsg('Please fill all fields'); return; }
      const users = JSON.parse(localStorage.getItem('miniso_users') || '[]');
      if(users.find(u=>u.email === email)){ showMsg('Email already registered'); return; }
      users.push({ name, email, pass });
      localStorage.setItem('miniso_users', JSON.stringify(users));
      setCurrentUser({ name, email });
      showMsg('Account created and logged in as ' + name);
      setTimeout(()=> location.href = 'index.html', 900);
    });
  }

  if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim().toLowerCase();
      const pass = document.getElementById('login-pass').value;
      const users = JSON.parse(localStorage.getItem('miniso_users') || '[]');
      const user = users.find(u=>u.email === email && u.pass === pass);
      if(!user){ showMsg('Invalid credentials'); return; }
      setCurrentUser({ name: user.name, email: user.email });
      showMsg('Logged in as ' + user.name);
      setTimeout(()=> location.href = 'index.html', 700);
    });
  }

  function showMsg(text){
    if(!msg) return;
    msg.textContent = text;
    msg.style.display = 'block';
    setTimeout(()=> msg.style.display = 'none', 3000);
  }
}

document.addEventListener('DOMContentLoaded', initAuth);
