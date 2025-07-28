import { Box, Container } from '@chakra-ui/react';
import React from 'react';
import PostPage from './pages/PostPage';
import Header from './components/Header';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import { Navigate } from 'react-router-dom';
import UpdateProfilePage from './pages/UpdateProfilePage';
import { SettingsPage } from './pages/SettingsPage'
import UserPageWithOptionalCreatePost from './components/UserPageWithOptionalCreatePost';
const App = () => {
  const user = useRecoilValue(userAtom);
	const location  = useLocation(); 


  const isAuthPage = location.pathname === "/auth";
  

  return (
    <Container
  maxW={location.pathname === "/" ? { base: "620px", md: "1000px" } : "750px"}
  minH="100vh"
  px={4}
  overflowX="hidden"
>
  {!isAuthPage && <Header />}

  <Box position="relative" w="full" overflowX="hidden">
    <Routes>
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
      <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />
      <Route path="/:username" element={<UserPageWithOptionalCreatePost />} />
      <Route path="/:username/post/:pid" element={<PostPage />} />
      <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
      <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/auth" />} />
    </Routes>
  </Box>
</Container>

  );
}

export default App;
