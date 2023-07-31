import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const Login = () => {


 const [email,setEmail] = useState();
 const [password , setPassword ] = useState();
 const [show,setshow] = useState(false);
 const handleClick = () => setshow(!show);
 const [loading,setLoading] = useState(false);
 const navigate = useNavigate();
 const toast = useToast();

  const submitHandler = async () =>{
         
    setLoading(true);

          if(!email || !password){
                toast({
          title:"please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position:"bottom"
        });
        setLoading(false);
        return;
          }
       
          try {
              const config = { 
                headers:{
                    "content-type": "application/json",
                },
              };

          const {data} = await axios.post("/api/user/login",{email,password},config);
                toast({
          title: "Login successful",
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:"bottom",
        });
        localStorage.setItem("userInfo",JSON.stringify(data));
        setLoading(false);
          navigate('/chats')
          }
           catch (error) 
           {
             toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status:"error",
          duration: 5000,
          isClosable: true,
          position:"bottom",
        });
            setLoading(false);
          }

        };

  return (

     <VStack spacing="5px">

       <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input 
        placeholder="Enter Your Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
     </FormControl>

 <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input 
        type={show?"text":"password"}
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
         
         <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ?"hide":"show"}
            </Button>
         </InputRightElement>
       </InputGroup>
     </FormControl>

   
     <Button 
    colourSchema="blue"
    width="100%"
    style={{marginTop:15}}
    onClick={submitHandler}
    isLoading={loading}
    >
      Login
    </Button>

     <Button 
     variant="solid"
    colourSchema="red"
    width="100%"
    
    onClick= {()=>{
        setEmail("guest@example.com");
        setPassword("123456");
    }}
    >
      Get Guest User Credentials
    </Button>
      
       </VStack>
  ) 
}

export default Login
