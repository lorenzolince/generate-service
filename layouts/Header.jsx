import Image from 'next/image';
import { Navbar, Nav, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useEffect, useState } from "react";
import Sidebar from '../components/Sidebar';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import UserInfo from '../components/common/UserInfo';
import { getSession, signIn, signOut } from 'next-auth/react';
import { EyeFill, EyeSlashFill, GooglePlay, Github } from "react-bootstrap-icons"; // Íconos más modernos
import { set, useForm } from 'react-hook-form';
import swal from 'sweetalert2/dist/sweetalert2.min.js';
import Spinner from 'react-bootstrap/Spinner';
import typesResources from '../services/typesResources';

const Header = () => {
  const { t, lang } = useTranslation();
  var interval;
  const [exprireToken, setExprireToken] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [mins, setMins] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userImage, setUserImage] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [show, setShow] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState(null);
  const { handleSubmit, formState, formState: { errors } } = useForm({

  });
  const handleClose = () => {
    setShow(false);
  }
  const handleProviderLogin = async (provider) => {
    setLoadingProvider(provider);
    await signIn(provider, { callbackUrl: '/' });
    handleClose
  }

  const _getSession = async () => {
    const userSession = await getSession();
    if (userSession) {
      setNameUser(userSession.user.name);
      setMins(userSession.tknMins);
      setExprireToken(userSession.tknMins);
      setUserImage(userSession.user.image);
      setShowLogin(true);
      if (userSession.tknMins === 0) {
        await signOut({ redirect: true, callbackUrl: '/' });
        setShowLogin(false);
      }
    } else {
      setShowLogin(false);
      console.log("setShowLogin");
    }
  }
  const handleLogout = async () => {
   await typesResources.singOutBackend();
    await signOut({ redirect: true, callbackUrl: '/' });
    setShowLogin(false);
    setExprireToken("");
    setNameUser("");
    setEmail("");
    setPassword("");
    setUserImage("");
    setShow(false);
    setShowLogin(false);
  }
  /*const handleLogin = async () => {
    const result = await signIn('credentials', { email, password, redirect: false });
    if (!result || result.error) {
      swal.fire({
        title: t('common:errorAuthTitle'),
        text: t('common:errorAuthText'),
        icon: "warning",
        timer: 3500,
        buttons: false,
      });

    } else {
      console.log("Autenticación exitosa:", result);
      setShowLogin(true);
      handleClose();
      _getSession();
    }

  };
  */
  useEffect(() => {
    _getSession();
    if (!interval) {
      setInterval(async () => {
        interval = await _getSession();
      }, 60000);
    }
  }, []);

  return (
    <div>
      <div className="header-Sidebar">
        <ul className="header-list">
          <li className="sidebar-item">
            <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
          </li>
          <li>
            <img className="image-item header-Image" src="/acaLogoicon.svg" alt="Generate Service" />
          </li>
          <li className="navbar-item">
            <Navbar className="header-Navbar" fixed="top" collapseOnSelect expand="md" variant="dark">
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav" className="custom-collapse-bg">
                <div className="nav-container">
                  <Nav>
                    <Link href="/"><h1 className="nav-link header-nav-color" role="button">{t('common:linkRest')}</h1></Link>
                    <Link href="/appGraphQL"><h1 className="nav-link header-nav-color" role="button">{t('common:linkGraphQL')}</h1></Link>
                    <Link href="/appWebSocket"><h1 className="nav-link header-nav-color" role="button">{t('common:linkWebSocket')}</h1></Link>
                    <Link href="/grpc"><h1 className="nav-link header-nav-color" role="button">{t('common:linkGrpc')}</h1></Link>
                    <Link href="/appSoap"><h1 className="nav-link header-nav-color" role="button">{t('common:linkSoap')}</h1></Link>
                    <Link href="/plans"><h1 className="nav-link header-nav-color" role="button">{t('common:linkPlans')}</h1></Link>
                  </Nav>

                  <div className="user-info-container">
                    {showLogin && <UserInfo exprireToken={exprireToken} nameUser={nameUser} image={userImage} />}
                    {!showLogin ?
                      <Nav>
                        <Nav.Link><h6 className="nav-link header-nav-color" role="button" onClick={() => setShow(true)}> {t('common:btSignIn')}</h6> </Nav.Link>
                      </Nav> : <Nav className="mr-auto">
                        <Link href="#" id="logOut" onClick={handleLogout}>
                          <h6 className="nav-link header-nav-color" role="button">{t('common:btSignOut')}</h6>
                        </Link>
                      </Nav>
                    }
                  </div>
                </div>

              </Navbar.Collapse>
            </Navbar>
          </li>
        </ul>
      </div>
      <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-90w" size="sm" aria-labelledby="example-custom-modal-styling-title" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            {t('common:loginTitle')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {
              /*<Row>
              <Col>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: "200px" }} // Ajustar ancho si es necesario
                />
              </Col><Col>
                <Form.Group style={{ position: "relative", display: "flex", alignItems: "center", width: "200px" }}>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: "35px" }} // Espacio para el botón
                  />
                  <Button
                    variant="link"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)", padding: 0, border: "none", color: "#555" }}
                  >
                    {showPassword ? <EyeSlashFill size={18} /> : <EyeFill size={18} />}
                  </Button>
                </Form.Group>
              </Col>
            </Row>*/
            }
            <br></br>
            <Row>
              <Col>
                <Button variant="warning" className="w-100 d-flex align-items-center justify-content-center gap-2 mb-2" onClick={() => handleProviderLogin('google')}>
                  {loadingProvider === 'google' ? <Spinner animation="border" size="sm" /> : <GooglePlay />}{t('common:googleLogin')}
                </Button>
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col>
                <Button variant="dark" className="w-100 d-flex align-items-center justify-content-center gap-2 mb-2" onClick={() => handleProviderLogin('github')}>
                  {loadingProvider === 'github' ? <Spinner animation="border" size="sm" /> : <Github />} {t('common:githubLogin')}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('common:btnCancel')}
          </Button>
          {/*
          <Button variant="primary" type="submit" onClick={handleSubmit(handleLogin)}>
            {t('common:btSignIn')}
          </Button>*/}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Header;