import { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import { Avatar, Box, Button, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from '@chakra-ui/react';
import { AiOutlinePlus } from "react-icons/ai";
import GroupChatModal from './chatitems/GroupChatModal';
import { MdMoreVert } from "react-icons/md";

const Mychats = ({ refresh, setRefresh }) => {
    const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
    const [loggedUser, setLoggedUser] = useState();

    const FetchChat = async () => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.get('https://chat-app-backend-aqda.onrender.com/api/chats', config);
            setChats(data);

            // ✅ Preserve selectedChat if still exists in new list
            setSelectedChat(prev => {
                if (!prev) return null;
                return data.find(c => c._id === prev._id) ? prev : null;
            });
        } catch (error) {
            console.log("Unable to fetchChat data in Mychats file");
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        FetchChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    const getSender = (loggedUser, users) => {
        if (!users || users.length < 2 || !loggedUser) return "";
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    };

    const getUserDetail = (users) => {
        if (!users || users.length < 2 || !loggedUser) return "";
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    };



    const deletedChatmsg = async () => {
        if (!selectedChat) return;


        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            const { data } = await axios.put(
                'https://chat-app-backend-aqda.onrender.com/api/message/delete',
                { chatId: selectedChat._id },
                config
            );

            console.log("Deleted message response:", data);

            // Update chats locally so latestMessage is hidden for logged user
            // it will check if login user delete all msg then it will not show to it untill next message arrive
            setChats(prevChats =>
                prevChats.map(chat =>
                    chat._id === selectedChat._id
                        ? { ...chat, latestMessage: null }
                        : chat
                )
            );

            // Clear the selected chat only when deleting all messages
            setSelectedChat(null);

            setRefresh(prev => !prev);
        } catch (error) {
            console.error("Error deleting messages:", error.response?.data || error.message);
        }
    };

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "33%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AiOutlinePlus />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                d="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => (chat.latestMessage &&
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat?._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat?._id === chat._id ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                                display="flex"
                                justifyContent="space-between"
                            >
                                <Box display="flex" gap="10px">
                                    <Avatar
                                        name={getUserDetail(chat.users).name}
                                        src={getUserDetail(chat.users).image}
                                        borderRadius="50%"
                                    />
                                    <Box>
                                        <Text>
                                            {!chat.isGroupChat
                                                ? getSender(loggedUser, chat.users)
                                                : chat.chatName}
                                        </Text>
                                        {chat.latestMessage && (
                                            <Text fontSize="xs">
                                                <b>{chat.latestMessage.sender.name} : </b>
                                                {chat.latestMessage.content.length > 40
                                                    ? chat.latestMessage.content.substring(0, 41) + "..."
                                                    : chat.latestMessage.content}
                                            </Text>
                                        )}
                                    </Box>
                                </Box>
                                <Box marginTop="3px">
                                    <Menu>
                                        <MenuButton as={Button}>
                                            <MdMoreVert size={24} />
                                        </MenuButton>
                                        <MenuList bg="grey" color="black" p="10px">

                                            <MenuItem onClick={deletedChatmsg}>Delete Chat</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <div>There is no chat now</div>
                )}
            </Box>
        </Box>
    );
};

export default Mychats;
