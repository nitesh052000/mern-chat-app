import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';



const Sighup = () => {

        const [show,setshow] = useState(false);
        const [name , setName ] = useState();
        const [email , setEmail ] = useState();
        const [password , setPassword ] = useState();
        const [confirmpassword , setconfirmpassword ] = useState();
        const [pic , setPic ] = useState();
        const [loading,setLoading] = useState(false);
        const navigate = useNavigate();
        const toast = useToast();
         const [picLoading, setPicLoading] = useState(false);

        const handleClick = () => setshow(!show);

        

        const submitHandler = async() =>{
                 
            if(!name || !email || !password || !confirmpassword){
                toast({
          title: "Please fill all fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
          });
          setLoading(false);
          return ;
         }
         
            if(password!=confirmpassword){
                toast({
          title: "Password Do not match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
          });
          return;
            }

            try{
                const config = {
                    headers:{
                        "Content-type":"application/json",
                    },

                };
          const { data} = await axios.post("/api/user",{name,email,password,pic},config);
                   toast({
          title: "Registration successful",
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:"bottom",
        });
             localStorage.setItem("userInfo" , JSON.stringify(data));
              setLoading(false);
              navigate('/chats')
            } 
            catch(error)
            {
                  toast({
          title: "error Ocrured",
          status: "error",
          duration: 5000,
          isClosable: true,
          position : "bottom",
        });
        setLoading(false);
            }

        };

         const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dzidl5hzf");
      fetch("https://api.cloudinary.com/v1_1/dzidl5hzf/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (

    <VStack spacing="5px">

     <FormControl id="name"  isRequired>
        <FormLabel>Name</FormLabel>
        <Input 
        placeholder='Enter Your Name'
        onChange={(e) => setName(e.target.value)}
        />
     </FormControl>

       <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input 
        placeholder='Enter Your Email Address'
        onChange={(e) => setEmail(e.target.value)}
        />
     </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input 
        type={show?"text":"password"}
        placeholder='Enter Password'
        onChange={(e) => setPassword(e.target.value)}
        />
         
         <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ?"hide":"show"}
            </Button>
         </InputRightElement>
       </InputGroup>
     </FormControl>

       <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
        <Input 
        type={show?"text":"password"}
        placeholder='Confirm Password'
        onChange={(e) => setconfirmpassword(e.target.value)}
        />
         
         <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ?"hide":"show"}
            </Button>
         </InputRightElement>
       </InputGroup>
     </FormControl>
           
      <FormControl id="pic" >
        <FormLabel>Upload your Picture</FormLabel>
        <Input 
        type = "file"
        p={1.5}
        accept="image/*"
        
        onChange={(e) => postDetails(e.target.files[0])}
        />
     </FormControl>
      
    <Button 
    colourSchema="blue"
    width="100%"
    style={{marginTop:15}}
    onClick={submitHandler}
    isLoading = {loading}
    >
      Sighup
    </Button>

    </VStack>
  );
};


export default Sighup
