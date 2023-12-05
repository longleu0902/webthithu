import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, NavbarBrand } from 'reactstrap';
import ModalAuth from './ModalAuth';
import './styles.css';
import AppContext from '../../Context/AppContext';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const navigate = useNavigate();

  const { userCurrent, setUserCurrent } = useContext(AppContext);

  const [users, setUsers] = useState([]);

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const statusAuth = useRef('login');

  const handleOpenModalAuth = status => {
    statusAuth.current = status;
    onOpen();
  };

  const handleRegister = async newUser => {
    let isExistEmail = false;
    for (let user of users) {
      if (user.email === newUser.email) {
        isExistEmail = true;
        break;
      }
    }
    if (isExistEmail === false) {
      console.log('Đăng ký thành công');
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      const content = await response.json();
      setUsers([...users, content]);
      onClose();
      setUserCurrent({ ...content });
      localStorage.setItem('user_info', JSON.stringify(content));
    } else {
      console.log('Email đã tồn tại');
      toast({
        title: 'Email đã tồn tại',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleLogin = infoUser => {
    let isLogin = false;

    for (let user of users) {
      if (
        user.email === infoUser.email &&
        user.password === infoUser.password
      ) {
        toast({
          title: 'Đăng nhập thành công',
          status: 'success',
          isClosable: true,
        });
        isLogin = true;
        onClose();
        setUserCurrent({ ...user });
        localStorage.setItem('user_info', JSON.stringify(user));
      }
    }

    if (isLogin === false) {
      toast({
        title: 'Đăng nhập không thành công',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_info');
    setUserCurrent({});
  };

  const handleGetUsers = async () => {
    const API_USERS = 'http://localhost:8080/users';

    try {
      const response = await fetch(API_USERS);
      const data = await response.json();
      setUsers([...data]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleRedirect = link => {
    navigate(link);
  };

  useEffect(() => {
    const user_info = JSON.parse(localStorage.getItem('user_info'));

    if (user_info?.username && user_info?.email) {
      setUserCurrent({ ...user_info });
    }

    handleGetUsers();
  }, []);

  return (
    <>
      <ModalAuth
        initialRef={initialRef}
        finalRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        statusAuth={statusAuth.current}
        onRegister={handleRegister}
        onLogin={handleLogin}
      />
      <Navbar color="dark" dark sticky="top">
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <NavbarBrand>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                alt="logo"
                src="/logo192.png"
                style={{
                  height: 40,
                  width: 40,
                }}
              />
              <NavLink
                style={{
                  color: 'white',
                }}
                to="/"
              >
                <span style={{ marginLeft: '8px' }}>Quizz Test</span>
              </NavLink>
            </div>
          </NavbarBrand>

          <div className="pages">
            <span style={{ marginLeft: '8px', marginRight: '8px' }}>
              <NavLink className="nav-bar-item" to="?subject=reactjs">
                ReactJS
              </NavLink>
            </span>
            <span style={{ marginLeft: '8px', marginRight: '8px' }}>
              <NavLink className="nav-bar-item" to="?subject=javascript">
                Javascript
              </NavLink>
            </span>
            <span style={{ marginLeft: '8px', marginRight: '8px' }}>
              <NavLink className="nav-bar-item" to="?subject=html">
                HTML
              </NavLink>
            </span>
            <span style={{ marginLeft: '8px', marginRight: '8px' }}>
              <NavLink className="nav-bar-item" to="?subject=css">
                CSS
              </NavLink>
            </span>
          </div>

          {userCurrent.username ? (
            <Menu>
              <MenuButton rightIcon={<ChevronDownIcon />}>
                <Stack spacing={4} direction="row" align="center">
                  <Avatar name={userCurrent.username} />
                  <Text color="white" as="b">
                    {userCurrent.username}
                  </Text>
                </Stack>
              </MenuButton>

              <MenuList>
                <MenuGroup title="Profile">
                  <MenuItem>Edit profile</MenuItem>
                  <MenuItem>Change password</MenuItem>
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </MenuGroup>
                {userCurrent?.role === 'admin' && (
                  <>
                    <MenuDivider />
                    <MenuGroup title="Admin">
                      <MenuItem
                        onClick={() => handleRedirect('/admin/create-quizz')}
                        icon={<AddIcon />}
                      >
                        Create quizz
                      </MenuItem>
                    </MenuGroup>
                  </>
                )}
              </MenuList>
            </Menu>
          ) : (
            <Stack spacing={4} direction="row" align="center">
              <Button
                colorScheme="teal"
                size="sm"
                onClick={() => handleOpenModalAuth('login')}
              >
                Đăng nhập
              </Button>

              <Button
                colorScheme="teal"
                size="sm"
                variant="outline"
                onClick={() => handleOpenModalAuth('register')}
              >
                Đăng ký
              </Button>
            </Stack>
          )}
        </div>
      </Navbar>
    </>
  );
};

export default Header;
