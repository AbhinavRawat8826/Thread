import React from 'react'
import { useMatch } from 'react-router-dom';
import UserPage from '../pages/UserPage';
import CreatePost from './CreatePost';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const UserPageWithOptionalCreatePost = () => {
    const user = useRecoilValue(userAtom);
    const match = useMatch("/:username");
    const usernameFromUrl = match?.params?.username;
  
    return (
      <>
        <UserPage />
        {user && user.username === usernameFromUrl && <CreatePost />}
      </>
    );
  };
  

export default UserPageWithOptionalCreatePost
