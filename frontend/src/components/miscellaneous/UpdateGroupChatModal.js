import React from 'react';
import { useDisclosure , useToast,Box,Input,Spinner,FormControl } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react';
import { ChatState } from '../../context/chatProvider';
import UserListItem from '../UserAvatar/UserListItem';
import { useState } from 'react';
import axios from 'axios';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const UpdateGroupChatModal = ({fetchagain, SetFetchAgain,fetchMessages}) => {

 const { isOpen, onOpen, onClose } = useDisclosure();
 const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

 const { SelectedChat, setSelectedChat, user } = ChatState();


  const handleSearch = async(query) => {
         setSearch(query);
     if(!query){
        return;
     }
     try{
        setLoading(true);

         const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.get(`/api/user?search=${search}`,config);
        setLoading(false);
        setSearchResult(data);
     }catch(error){
           toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
     }
  };

  const handleRename = async() =>{
        if(!groupChatName)
        return;

        try{
          setRenameLoading(true);
           const config = {
            headers: {
          Authorization: `Bearer ${user.token}`,
        },
           };
          
         const {data} = await axios.put("/api/chat/rename",
         {
            chatId: SelectedChat._id,
            chatName: groupChatName,    
         },
         config
         );
         setSelectedChat(data);
         SetFetchAgain(!fetchagain); 
           setRenameLoading(false);
        }
        catch(error){
            toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
        }
        setGroupChatName("");
  };

  const handleRemove = async(user1) =>{
         if (SelectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      SetFetchAgain(!fetchagain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async(user1) => {

      if (SelectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
        if (SelectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    } 


           try{

         setLoading(true);
        const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          },
        };
        
        const {data} = await axios.put("/api/chat/groupadd",{
            
            chatId:SelectedChat._id,
            userId:user1._id,

        }, config);
           setSelectedChat(data);
           SetFetchAgain(!fetchagain);
           setLoading(false);

           }catch(error){
                 toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
           setLoading(false); 
           }
           setGroupChatName("");
  };

  return (
   <>
    <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
           fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"  
          >{SelectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody display="flex" flexDir="column" alignItems="center">
           <Box>
            {SelectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={SelectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
           </Box>
             <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
               <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
              </FormControl>
              <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading? (
                <Spinner size="lg" />
            ) : (
                searchResult?.map((user) =>{
                    <UserListItem
                    key ={user._id}
                    user = {user}
                    handleFunction={() => handleAddUser(user)}
                    /> 
                })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
   </>
  )
}

export default UpdateGroupChatModal
