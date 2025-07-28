import React from 'react';
import { Box, Flex, Img, Text ,Button} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

const NotFoundScreen = () => {
  return (
    <>
    <Img src='/error.svg'/>
    <NavLink to="/">
        <Flex justifyContent={'center'}>
        <Button fontSize={'lg'} marginTop={'2rem'} 
         bg={"red.300"}
         size={"sm"}
         color={"black"}
         _hover={{
           bg: "red.500",
           cursor: "pointer",
         }}
        
        > 
          Go Back
          
      </Button>
        </Flex>
      </NavLink>
    
    </>
  );
};

export default NotFoundScreen;
