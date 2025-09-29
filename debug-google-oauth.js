// Test script để debug Google OAuth
// Chạy trong browser console để test

// 1. Lấy Google credential từ browser
console.log('Testing Google OAuth...');

// 2. Test backend endpoint
const testGoogleAuth = async (credential) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/google-signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.status === 401) {
      console.error('401 Error - Possible causes:');
      console.error('- Google Client ID mismatch');
      console.error('- Invalid token verification');
      console.error('- Domain not authorized in Google Console');
    }
    
  } catch (error) {
    console.error('Network error:', error);
  }
};

// 3. Instructions
console.log('To test:');
console.log('1. Get credential from GoogleLogin onSuccess callback');
console.log('2. Call testGoogleAuth(credential)');