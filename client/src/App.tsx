import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { LoginCallback, Security } from '@okta/okta-react';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import oktaConfig from "./oktaConfig";
import Home from './routes/Home';
import Login from './routes/Login';
import Logout from './routes/Logout';
import NotFound from './routes/NotFound';
import SecureLayout from './SecureLayout';

export default function App() {

  let navigate = useNavigate();

  const oktaAuth = new OktaAuth(oktaConfig.oidc);

  useEffect(() => {
    oktaAuth.start(); // start the service

    return () => {
      oktaAuth.stop(); // stop the service
    }

  }, [oktaAuth]);

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: string) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Routes>
        <Route path="/login/callback" element={<LoginCallback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<SecureLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Security>
  );
}