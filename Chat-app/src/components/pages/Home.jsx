import {
  Box,
  Container,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/tabs";

import Login from "../authentication/Login";
import Register from "../authentication/Register";
import { Toaster } from "sonner"; // ✅ Import this!
import { useEffect } from "react";
import image from '../../assets/logo1.jpg'

function Home() {

  const navigate = useNavigate()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"))  // get info which store during login or login page


    if (user) {   // if user  login send him to chat page
      navigate('/chats')
    }
  }, [navigate])
  return (
    <>
      <Toaster richColors position="top-right" />
      <Container maxW="l" centerContent width="500px" margin="20px">
        <Box
          display="flex"
          justifyContent="center"
          alignContent="center"
          p={3}
          bg="white"
          w="100%"
          m="20px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text fontSize="2xl" fontFamily="'Work Sans', sans-serif" display="flex">
            <img src={image} alt="logo" className="h-[50px] w-[30px] mr-3 rounded-4xl" />
            Real-Chat
          </Text>
        </Box>

        <Box bg="white" w="100%" p={3} borderRadius="lg" borderWidth="1px">
          <Tabs isFitted variant="soft-rounded" colorScheme="teal">
            <TabList mb="1em">
              <Tab w="50%" cursor="pointer" _hover={{
                color: "blue",
                transform: "scale(1.05)",
                transition: "all 0.2s ease-in-out",
              }}>
                Login
              </Tab>
              <Tab w="50%" cursor="pointer" _hover={{
                color: "blue",
                transform: "scale(1.05)",
                transition: "all 0.2s ease-in-out",
              }}>
                Sign Up
              </Tab>

            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Register />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>


  );
}

export default Home;


//toster is used to tast message which show on screen
