import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GoogleOAuthWrapper = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={"249202020834-sr0l0l25mp83gfo3lohp1du3ca1ql0pu.apps.googleusercontent.com"}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleOAuthWrapper;