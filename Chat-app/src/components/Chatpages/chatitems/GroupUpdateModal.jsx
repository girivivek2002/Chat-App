import { Box, Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { FaEye } from 'react-icons/fa';
import { ChatState } from '../../context/ChatProvider';
import ProfileModel from './ProfileModel';
import axios from 'axios';

const GroupUpdateModal = ({ users, refresh, setRefresh, fetchMessages }) => {  //fetchMessages it is from single chat file help to fetch messages
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast()

    const [selectedUser, setSelectedUser] = useState()
    const { user, selectedChat, setSelectedChat, setChats } = ChatState()

    const handleClick = async (userId) => {


        try {
            if (selectedChat.groupAdmin._id !== user._id && userId !== user._id) {
                toast({
                    title: 'Not allowed',
                    description: "Only admin can make changes",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
                return;
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('https://chat-app-backend-aqda.onrender.com/api/chats/groupremove', { chatId: selectedChat._id, userId: userId }, config)
            userId !== user._id ? setSelectedChat() : setSelectedChat(data)
            console.log(data)
            fetchMessages();  // call fetchmessages from singlechat file to show messages
            setRefresh(!refresh)  // it will refresh chat page for more se mychat page


        } catch (error) {
            console.log(error)
            toast({
                title: 'Failed',
                description: "Enable to create group",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })

        }

    }
    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<FaEye className="w-5 h-5 text-gray-600" />} onClick={onOpen} aria-label="View Profile" />

            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent paddingBottom="15px">
                    <ModalHeader
                        fontSize={{ base: "25", md: "40px" }}
                        fontFamily="Work sans"
                        display="flex"

                        justifyContent="center"
                        alignItems="center"
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                    >
                        <Text fontSize="20px" color="blue">Members</Text>
                        <Box overflowY="hidden">
                            {users.map((user) => (
                                <Box key={user._id} display="flex" alignItems="center" justifyContent="space-between" bg="blue.200" marginBottom="5px" paddingLeft="5px" borderRadius="lg" >
                                    <ProfileModel user={user}>
                                        <Box display="flex" flexDirection="column" cursor="pointer">
                                            <Text>{user.name}</Text>
                                            <Text>{user.email}</Text>
                                        </Box>
                                    </ProfileModel>


                                    <Button bg="red" color="white"
                                        width="30%" marginRight="10px"
                                        _hover={{ color: "black", bg: "grey" }}
                                        onClick={() => handleClick(user._id)}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            ))}
                        </Box>


                    </ModalBody>

                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupUpdateModal
