import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { FaBell, FaSearch } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { ChatState } from '../context/ChatProvider';
import ProfileModel from './chatitems/ProfileModel';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingUser from './chatitems/LoadingUser';
import ShowUsers from './chatitems/ShowUsers';






const SideDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure() // it is from chakra ui to open below items
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)


    const Navigate = useNavigate()
    const toast = useToast();

    const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()   // imortand from chatprovider file

    function logouthandle() {
        localStorage.removeItem("userInfo")

        Navigate('/')
    }

    async function searcUserHandle() {

        if (!search) {

            toast({
                title: 'Search',
                description: "Find user type user name or email",
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            return;
        }
        try {
            setLoading(true)
            const config = {  // it will help to know the data is in json form
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
            console.log(data)
            setSearch('')

            if (data.length < 1) {
                setLoading(true)
            }

        } catch (error) {
            console.log("data not received from backebd on sideDrawer")
        }


    }

    // it show chat user chat box 
    const accessChat = async (userId) => {
        setLoadingChat(true)
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post('/api/chats', { userId }, config) // send user id to backend for chat pahge and create chat
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);  // if this chat not available in chat array then it will add new chat in chats array
            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
            console.log(data)
            alert("successfully created")
        } catch (error) {
            console.log("error in sideDrawer accessChat funtion")

        }


    }

    const getSender = (loggeduser, users) => {
        if (!users || users.length < 2 || !loggeduser) return "";
        return users[0]._id === loggeduser._id ? users[1].name : users[0].name
    }

    // for get notification when user login
    useEffect(() => {
        axios.get("/api/notification", {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(res => {
            setNotification(res.data);
        });
    }, [user]);



    // when click on notification it remove from icon and database
    const handlenotifiaction = async (notifiactionchat) => {
        // 1️⃣ Set the selected chat
        setSelectedChat(notifiactionchat.chat);

        // 2️⃣ Remove from frontend state immediately (optimistic update)
        setNotification(prev =>
            prev.filter(not => not.chat._id !== notifiactionchat.chat._id)
        );

        // 3️⃣ Tell backend to remove it from database
        try {
            await axios.delete("/api/notification", {
                headers: { Authorization: `Bearer ${user.token}` },
                data: { chatId: notifiactionchat.chat._id }
            });
        } catch (error) {
            console.error("Failed to remove notification:", error);
        }
    };


    //when click on chat it remove notification of that chat
    useEffect(() => {
        const clearNotificationsForChat = async () => {
            if (selectedChat) {
                // Remove locally
                setNotification(prev =>
                    prev.filter(n => n.chat._id !== selectedChat._id)
                );

                // Remove from backend
                try {
                    await axios.delete("/api/notification", {
                        headers: { Authorization: `Bearer ${user.token}` },
                        data: { chatId: selectedChat._id }
                    });
                } catch (error) {
                    console.error("Error clearing notifications:", error);
                }
            }
        };

        clearNotificationsForChat();
    }, [selectedChat, user.token]);  // user.token uses because it change when user login or logout


    return (
        <>

            <Box display="flex" marginBottom="1.5" justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="2px">
                <Tooltip label="Search for user" aria-label='A tooltip'>
                    <div className="search flex align-middle bg-gray-600 text-gray-50 p-1 gap-[2px] rounded-3xl cursor-pointer" onClick={onOpen} >

                        <Text display={{ base: "none", md: "flex" }} px={4}>Search</Text>
                        <FaSearch className="text-gray-50" />
                    </div>

                </Tooltip>
                <Text fontSize={{ base: "20px", md: "25px" }} color="green" fontWeight="bold">Real-Chat</Text>
                <div className="menu flex gap-5">
                    <Menu >
                        <MenuButton as={Button} display="flex" position="relative">
                            <FaBell className="text-gray-600 w-6 h-6" />

                            {notification.length > 0 &&
                                <Box w={5} h={5} borderRadius="full" bg="red.500" color="white" position="absolute" top="10%" left="60%">{notification.length}</Box>}

                        </MenuButton>
                        <MenuList bg="blue.100" p="10px" display="flex" flexDirection="column" gap="10px" >
                            {!notification.length && "No New Messages"}

                            {notification?.map((noti, i) => (
                                <MenuItem key={i} display="flex"
                                    gap="5px" fontSize="15px" paddingLeft="5px"
                                    bg="gray.500" borderRadius="lg" color="white" fontWeight="bold">


                                    <span onClick={() => handlenotifiaction(noti)}>
                                        {noti.chat.isGroupChat ? `New notification in ${noti.chat.chatName}` :
                                            `New notification from ${getSender(user, noti.chat.users)}`}
                                    </span>
                                    {/* <span onClick={() => handlenotifiaction(noti)}>
                                        New notification in  {noti.chat.isGroupChat ? noti.chat.chatName :
                                            getSender(user, noti.chat.users)}
                                    </span> */}

                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={< FiChevronDown className="w-5 h-5 text-gray-800" />}>
                            <Avatar name={user.name} src={user.image} />
                        </MenuButton>
                        <MenuList bg="white" p="10px">
                            {/* ProfileModel is file see profilemodel file */}
                            <ProfileModel user={user}>
                                <MenuItem>My profile</MenuItem>
                            </ProfileModel>

                            <MenuItem onClick={logouthandle}>Logout...</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button bg="blue.600" onClick={searcUserHandle} >Go</Button>
                        </Box>
                        {loading ? (
                            <LoadingUser />
                        ) : (
                            searchResult?.map((user) => (
                                <ShowUsers
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}

                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer


// icons are import from install fontawesome package and react-icon package


// < ProfileModel user = { user } >
//     <MenuItem>My profile</MenuItem>
// </ProfileModel >

// profileModel imported from profileModel file and it take 2 parameter user and children that why i pass user init
