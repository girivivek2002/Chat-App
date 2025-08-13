import { Avatar, Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Toast, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";

import { useToast } from '@chakra-ui/react'
import ShowUsers from './ShowUsers'
import UserBadgeIcon from "./UserBadgeIcon";


const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatname, setGroupChatName] = useState('')
    const [selectedUser, setSelectedUser] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)


    const { user, chats, setChats } = ChatState()  // imported
    const toast = useToast();


    const handleSearch = async (query) => {
        setSearch(query)  // = setSearch(e.target.value) 
        if (!query) {
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`https://chat-app-backend-aqda.onrender.com/api/user?search=${search}`, config)
            console.log(data)
            setSearchResult(data)
            setLoading(false)


        } catch (error) {
            console.log("error in GroupchatModal", error.message)
            toast({
                title: 'Failed fetch data',
                description: "Failed to fetch user",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })

        }
    }

    const handleAddUser = (users) => {
        if (selectedUser.includes(users)) {
            console.log("user already exist")
            toast({
                title: 'User exist',
                description: "user already exist",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            return;
        }

        setSelectedUser([...selectedUser, users]) // it will put userId in selectedUser

    }

    const handledelete = (user) => {
        setSelectedUser(selectedUser.filter((data) => data._id !== user._id))  // except that user give all the user in setSelectedUser

    }

    const handleSubmit = async () => {
        if (!groupChatname || !selectedUser) {
            toast({
                title: 'Required',
                description: "fill all the field first",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post('https://chat-app-backend-aqda.onrender.com/api/chats/group', { name: groupChatname, users: JSON.stringify(selectedUser.map((u) => u._id)) }, config)
            setChats([data, ...chats]) // add this data into chats at the top
            toast({
                title: 'Create New Group',
                description: "New group chat is created",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            console.log(data)
        } catch (error) {
            console.log("error to post data groupchat : ", error.message)
            toast({
                title: 'Failed',
                description: "failed to craete group chat",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent h="500px">
                    <ModalHeader
                        fontSize={{ base: "20px", md: "25px" }}
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap="10px"
                    >
                        <FormControl display="flex" flexDirection="column" gap="10px" >

                            <Input type='text' placeholder='Group Name' value={groupChatname} onChange={(e) => setGroupChatName(e.target.value)} />
                            <Input type='text' placeholder='User Name' value={search} onChange={(e) => handleSearch(e.target.value)} />

                        </FormControl>
                        <Box display="flex">
                            {selectedUser.map((user) => (<UserBadgeIcon key={user._id} user={user} hahdledelete={() => handledelete(user)} />))}
                        </Box>

                        {loading ? <div>Loading...</div> : (
                            searchResult?.slice(0, 3).map(users => (
                                <ShowUsers
                                    key={users._id}
                                    user={users}
                                    handleFunction={() => handleAddUser(users)}
                                />
                            ))
                        )}

                    </ModalBody>
                    <ModalFooter>
                        <Button color="black" bg="blue.500" onClick={handleSubmit}>Create Chat</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default GroupChatModal;
