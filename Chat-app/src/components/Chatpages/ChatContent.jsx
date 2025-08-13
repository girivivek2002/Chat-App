import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './chatitems/SingleChat.jsx'

const ChatContent = ({ refresh, setRefresh }) => {
    const { user, setUser, chats, setChats, selectedChat, setSelectedChat } = ChatState()
    return (
        <>
            <Box
                display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
                alignItems="center"
                flexDirection="column"
                width={{ base: "100%", md: "65%" }}
                bg="white"
                borderRadius="lg"
            >
                <SingleChat refresh={refresh} setRefresh={setRefresh} />
            </Box>
        </>
    )
}

export default ChatContent
