// Simple session store (use Redis/DB in production)
const sessions = new Map();

// Generate session token
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Login function
export async function login(email, password) {
  // For testing - replace with your actual admin credentials
  const adminEmail = process.env.ADMIN_EMAILS?.split(',')[0] || 'admin@ieee.org';
  const adminPassword = process.env.ADMIN_PASSWORDS?.split(',')[0] || 'admin123';
  
  if (email === adminEmail && password === adminPassword) {
    const token = generateToken();
    sessions.set(token, {
      email,
      loginTime: Date.now(),
    });
    return { success: true, token };
  }
  
  return { success: false, error: 'Invalid credentials' };
}

// Verify session
export async function verifySession(token) {
  const session = sessions.get(token);
  if (!session) return false;
  
  // Session expires after 24 hours
  if (Date.now() - session.loginTime > 24 * 60 * 60 * 1000) {
    sessions.delete(token);
    return false;
  }
  
  return true;
}

// Logout
export async function logout(token) {
  sessions.delete(token);
  return { success: true };
}