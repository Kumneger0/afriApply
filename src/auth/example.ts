import { loginToAfriwork, cleanup, isLoggedIn, type LoginCredentials } from './login.js';

async function main() {
  const credentials: LoginCredentials = {
    email: 'your-email@example.com',
    password: 'your-password'
  };

  try {
    const session = await loginToAfriwork(credentials, {
      headless: false, 
      timeout: 30000
    });

    console.log('Successfully logged in!');
    
    const loggedIn = await isLoggedIn(session.page);
    console.log('Login status:', loggedIn);

    await session.page.goto('https://afriwork.com/dashboard');
    
    
    await cleanup(session);
    
  } catch (error) {
    console.error('Login failed:', error);
  }
}

// main();