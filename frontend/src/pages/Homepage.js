import React from 'react'
import { Container,
  Box ,
  Text, 
  
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 

} from '@chakra-ui/react';
import Login from '../components/authentication/Login';
import Sighup from '../components/authentication/Sighup';
import { useNavigate} from 'react-router-dom';
import { useEffect } from 'react';

const Homepage = () => {

  const navigate = useNavigate();

  useEffect(()=>{


        const user =   JSON.parse(localStorage.getItem("userInfo"));
        if(user){
            navigate("/chats");
        }
     },[navigate]);

  return (
    <Container maxW='xl' centerContent>
        <Box
        d = 'flex'
        justifyContent="Center"
        p={3}
        bg={"white"}
        w = "100%"
        m ="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="lpx"
         >
          <Text fontSize="4xl" font-family="Work sans" color="black" justifyContent='Center' >
          TALK-A-TIVE
          </Text>
        </Box>

        <Box bg="White" w="100%" p={4} borderRadius="lg" borderWidth="lpx">
   <Tabs variant="soft-rounded">
               <TabList mb="1em">
             <Tab width="50%">Login</Tab>
            <Tab width="50%">Sigh Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel> <Login /> </TabPanel>
              <TabPanel><Sighup />  </TabPanel>
               </TabPanels>
</Tabs>
        </Box>
    </Container>
  )
}

export default Homepage
