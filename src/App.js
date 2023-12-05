import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Container,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import Header from './layouts/Header';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import CreateQuizz from './pages/CreateQuizz';
import AdminRoute from './private-router/AdminRoute';
import AppContext from './Context/AppContext';
import QuizzTest from './pages/QuizzTest';

function App() {
  const [userCurrent, setUserCurrent] = useState({});

  return (
    <ChakraProvider theme={theme}>
      <AppContext.Provider
        value={{
          userCurrent: userCurrent,
          setUserCurrent: setUserCurrent,
        }}
      >
        <Header />
        <Container className="mt-5" style={{ minWidth: '936px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminRoute />}>
            <Route path="create-quizz" element={<CreateQuizz />} />
            </Route>
            <Route path="/quizz-test/:slug" element={<QuizzTest />} />
          </Routes>
        </Container>
      </AppContext.Provider>
    </ChakraProvider>
  );
}

export default App;
