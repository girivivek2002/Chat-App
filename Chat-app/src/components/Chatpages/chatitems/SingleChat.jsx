import { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, Button, FormControl, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { AiOutlineArrowLeft, AiOutlinePlus } from 'react-icons/ai'
import ProfileModel from './ProfileModel'
import GroupUpdateModal from './GroupUpdateModal'
import AddUserToGroup from './AddUserToGroup'
import { FaFolder, FaPaperPlane } from 'react-icons/fa'
import axios from 'axios'
import '../chatlogic/style.css'
import ManageMessages from './ManageMessages'
import io from 'socket.io-client'; // for socket io

var socket, compareChatmessages;   // variable for socket used in useEffect below




const SingleChat = ({ refresh, setRefresh }) => {
    const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()

    const [message, setMessage] = useState([])
    const [loading, setLoding] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const [loggedUser, setLoggedUser] = useState()
    const toast = useToast()




    // logic for socket io for login user setup
    useEffect(() => {
        if (!user) return;
        socket = io('https://chat-app-backend-aqda.onrender.com') // backend address  // it will connect front to backend socket


        socket.emit("setup", user)  // send user to setup 
        socket.on("connected", () => setSocketConnected(true))   // it receive 
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop-typing", () => setIsTyping(false))
    }, [])


    // for notificationn and receive msg from socket.io
    useEffect(() => {
        socket.on("message-received", (newMessagerecieve) => {
            if (!selectedChat || selectedChat._id !== newMessagerecieve.chat._id) {
                if (!notification.some(not => not._id === newMessagerecieve._id)) {
                    setNotification(prev => [newMessagerecieve, ...prev]);

                    axios.post("https://chat-app-backend-aqda.onrender.com/api/notification",
                        { notification: newMessagerecieve },
                        { headers: { Authorization: `Bearer ${user.token}` } }
                    );
                    setRefresh(prev => !prev);
                }
            } else {
                setMessage(prev => [...prev, newMessagerecieve]);
            }
        });

        return () => {    // it will remove previous socket before taking new notification
            socket.off("message-received");
        };
    }, [selectedChat, notification, user.token]);





    // function for show user name
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    }, []);

    function getSender(loggedUser, users) {
        if (!users || users.length < 2 || !loggedUser) return "";

        const sendername = users[0]._id === loggedUser._id ? users[1].name : users[0].name
        return sendername;
    }

    // if login user and first user of selectedchat is same then give second user otherwise give first user
    const getUserDetail = (users) => {
        if (!users || users.length < 2 || !loggedUser) return "";
        const senderdetail = users[0]._id === loggedUser._id ? users[1] : users[0]
        return senderdetail;
    }
    const handleBack = () => {
        setSelectedChat()
    }

    async function fetchMessages() {
        if (!selectedChat) return;
        try {
            setLoding(true)
            const config = {
                headers: {

                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`https://chat-app-backend-aqda.onrender.com/api/message/${selectedChat._id}`, config)
            setMessage(data)
            setLoding(false)
            //console.log(message)
            socket.emit('join-chat', selectedChat._id)

        } catch (error) {
            console.log(error)
            toast({
                title: 'Something went Wrong',
                description: "Enable to fetch data",
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-left'
            })
        }

    }
    useEffect(() => {
        fetchMessages()

        compareChatmessages = selectedChat;  // for check below
    }, [selectedChat]) // when selectedchat changes it it will fetch again


    // socket for check message 



    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("typing", selectedChat._id)
            try {
                setLoding(true)
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.post('https://chat-app-backend-aqda.onrender.com/api/message', { chatId: selectedChat._id, content: newMessage }, config)
                setMessage([...message, data])
                // console.log(data)


                toast({
                    title: 'Message',
                    description: "Message sent successfully",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-left'
                })
                socket.emit('new-message', data)  // for socket io to send data
                setNewMessage('')
                setLoding(false)

                setRefresh(!refresh)


            } catch (error) {
                console.log(error)
                toast({
                    title: 'Error',
                    description: "Can not send message",
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-left'
                })
            }
        }

    }
    async function handleSend() {
        if (newMessage) {
            try {
                setLoding(true)
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.post('https://chat-app-backend-aqda.onrender.com/api/message', { chatId: selectedChat._id, content: newMessage }, config)
                setMessage([...message, data])
                // console.log(data)
                socket.emit('new-message', data)   // for socket io to send data
                setNewMessage('')

                setRefresh(!refresh)
                setLoding(false)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleTyping = (e) => {
        setNewMessage(e.target.value)

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()   // store time when handleTyping run (typing start)
        var timeLength = 3000   // 3 sec

        setTimeout(() => {
            var timeNow = new Date().getTime()  // it will store after 3 sec of run handleTyping
            var timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timeLength && typing) {
                socket.emit("stop-typing", selectedChat._id)
                setTyping(false)
            }

        }, timeLength);

    }


    return (
        <>
            {selectedChat ? (
                <>

                    <Box
                        fontSize={{ base: "20px", md: "30px" }}
                        p={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                        bg="gray.300"
                        borderRadius="lg"
                    >

                        <Button display={{ base: "flex", md: "none" }} onClick={handleBack}>
                            <AiOutlineArrowLeft />
                        </Button>
                        <Text>
                            {!selectedChat.isGroupChat ? (getSender(loggedUser, selectedChat.users)) : (selectedChat.chatName)}
                        </Text>
                        <Text display="flex" gap="5px" alignSelf="center">
                            {selectedChat.isGroupChat ? (<AddUserToGroup refresh={refresh} setRefresh={setRefresh}>
                                <Button marginTop={{ base: 'none', md: '-8px' }}>
                                    <AiOutlinePlus />
                                </Button>
                            </AddUserToGroup>) : (<></>)}
                            {!selectedChat.isGroupChat ? (<ProfileModel user={getUserDetail(selectedChat.users)} />) :
                                (<GroupUpdateModal users={selectedChat.users} refresh={refresh} setRefresh={setRefresh} fetchMessages={fetchMessages} />)}
                        </Text>

                    </Box>
                    <Box display="flex"
                        flexDirection="column"
                        bg="gray.100"
                        height="100%" width="100%"

                        borderRadius="lg"
                        padding="10px"
                        justifyContent="flex-end"
                        overflowY="hidden"
                    >
                        {loading ? (<Spinner size="xl" width={10} height={10} alignSelf="center" margin="auto" />) : (
                            <div className='messages-chat'>
                                <ManageMessages messages={message} />
                            </div>
                        )}
                        {isTyping ? (<div>typing...</div>) : (<></>)}
                        <FormControl display="flex" mt={3}
                            onKeyDown={sendMessage} isRequired>

                            <Input type='text'
                                placeholder='type here messages'
                                bg="#E0E0E0" marginRight="10px"

                                value={newMessage}
                                onChange={handleTyping}
                            />


                            {/* <Button type='file' bg="green.200" marginRight="10px">
                                <FaFolder color="goldenrod" />
                            </Button> */}
                            <Button bg="blue.400" _hover={{ bg: "green.400" }} onClick={handleSend}> <FaPaperPlane /></Button>
                        </FormControl>
                    </Box>
                </>) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )
            }
        </>

    )
}

export default SingleChat
