
import {ChatState} from "../context/chatProvider";
import { Box } from '@chakra-ui/react';
import SideDrawer from "../components/miscellaneous/SideDrawer";
import  MyChats from "../components/MyChats";
import ChatBox  from "../components/Chatbox";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";




const ChatPage = () => {

  const {user} = ChatState();
   const [fetchagain , setFetchAgain] = useState(false);
  
  return <div style={{width:"100%"}}>
     {user && <SideDrawer />}
    <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
      {user && <MyChats fetchagain = {fetchagain}/> }
       {user && <ChatBox fetchagain ={fetchagain} setFetchAgain={setFetchAgain}/>}
    </Box>
  </div>
  
};

export default ChatPage;
