import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import {
  Box,
  FormControl,
  Spinner,
  Text,
  Input,
  useToast,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/animation_lkl1ccws.json"

const ENDPOINT = "http://localhost:5000";
var socket , SelectedChatCompare;



const SingleChat = ({ fetchagain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected,setsocketConnected] = useState(false);
  const { SelectedChat, setSelectedChat, user,notification,setNotification} = ChatState();
  const [typing , setTyping] = useState(false);
  const [ isTyping , setisTyping] = useState(false);


 const defaultOptions = {
   loop: true,
   autoplay: true,
   animationData: animationData,
   rendererSettings: {
     preserveAspectRatio: "xMidYMid slice",
   },
 };



  const toast = useToast();
  
  const fetchMessages = async () => {
    if (!SelectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${SelectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat",SelectedChat._id);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setsocketConnected(true));
    socket.on("typing",() =>setisTyping(true));
    socket.on("stop typing",() => setisTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    SelectedChatCompare = SelectedChat;
  }, [SelectedChat]);

  useEffect(() =>{
    socket.on("message received",(newMessageReceived) =>{
       
     if(!SelectedChatCompare || SelectedChatCompare._id!== newMessageReceived.chat._id){
            if(!notification.includes(newMessageReceived)){
              setNotification([newMessageReceived,...notification]);
              setFetchAgain(!fetchagain);
            }
     }else{
      setMessages([...messages,newMessageReceived]);
     }
      
    });
  })

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: SelectedChat._id,
          },
          config
        );
        console.log(data);
     


       socket.emit("new message",data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

     if(!socketConnected)return;

     if(!typing){
      setTyping(true);
      socket.emit("typing",SelectedChat._id);
     }

     let lasttypingtime  = new Date().getTime();
     var timeLength = 3000;
     setTimeout(() =>{
        var timenow = new Date().getTime();
        var timediff = timenow - lasttypingtime;

        if(timediff>=timeLength && typing){
          socket.emit("stop typing",SelectedChat._id);
          setTyping(false);
        }
     }, timeLength);
  };

  return (
    <>
      {SelectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!SelectedChat.isGroupchat ? (
              <>
                {getSender(user, SelectedChat.users)}
                <ProfileModel user={getSenderFull(user, SelectedChat.users)} />
              </>
            ) : (
              <>
                {SelectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchagain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie options={defaultOptions} width={70} 
                  style={{marginBottom:15,marginLeft:4}}
                   />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
