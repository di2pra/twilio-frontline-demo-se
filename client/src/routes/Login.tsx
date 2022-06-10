import { useOktaAuth } from "@okta/okta-react";
import { useCallback } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import HowToSection from "./Home/HowToSection";

const Login = () => {

  const { oktaAuth, authState } = useOktaAuth();

  const triggerLogin = useCallback(async () => {
    await oktaAuth.signInWithRedirect();
  }, [oktaAuth]);

  if (authState && authState.isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <Container className="mt-3" fluid>
      <Row className="justify-content-md-center">
        <Col lg={10}>
          <Row className="mb-3">
            <Col>
              <Button onClick={() => { triggerLogin() }}>Login using Okta</Button>
            </Col>
          </Row>
          <HowToSection />
        </Col>
      </Row>
    </Container>
  );
}

export default Login;