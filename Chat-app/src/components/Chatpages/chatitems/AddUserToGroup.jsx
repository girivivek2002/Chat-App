import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react'
import ShowUsers from './ShowUsers'
import UserBadgeIcon from './UserBadgeIcon'
import axios from 'axios'
import { FaTimes } from 'react-icons/fa'

const AddUserToGroup = ({ children, refresh, setRefresh }) => {
    const { user, setUser, chats, setChats, selectedChat, setSelectedChat } = ChatState()
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [groupReName, setGroupReName] = useState()
    const [loading, setLoading] = useState(false)

    const toast = useToast()


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
    const handleAddUser = (user) => {
        setSelectedUser(user) // it will put userId in selectedUser
        console.log(user)
    }

    const handledelete = () => {
        setSelectedUser()
    }

    const AddUserInGroup = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: 'User exist',
                description: "user already exist in group",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Not allowed',
                description: "Only user can make changes",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('https://chat-app-backend-aqda.onrender.com/api/chats/groupadd', { chatId: selectedChat._id, userId: user1._id }, config)
            console.log(data)
            setSelectedChat(data)
            setRefresh(!refresh)
            setLoading(false)
            setSearch()
            setSelectedUser(null)
        } catch (error) {
            console.log(error)
        }

    }
    const UpdateGpName = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('https://chat-app-backend-aqda.onrender.com/api/chats/rename', { chatId: selectedChat._id, chatName: groupReName }, config)
            console.log(data)
            setSelectedChat(data)
            setRefresh(!refresh)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader
                        fontSize={{ base: "20px", md: "25px" }}
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
                        alignItems="center"
                        gap="10px"
                    >
                        <Text>
                            Add Members
                        </Text>
                        <FormControl display="flex" gap="10px" >
                            <Input type='text' placeholder='Update Group Name' value={groupReName} onChange={(e) => setGroupReName(e.target.value)} />
                            <Button onClick={UpdateGpName}>Update</Button>
                        </FormControl>
                        <FormControl display="flex" flexDirection="column" gap="10px" >
                            <Input type='text' placeholder='User Name' value={search} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {selectedUser ? (
                            <Box display="flex" bg="purple" color="white" borderRadius="lg" p="3px" alignItems="center" gap="8px">
                                <Box>{selectedUser.name}</Box>
                                <FaTimes onClick={handledelete} style={{ cursor: 'pointer' }} />
                            </Box>
                        ) : null}

                        {loading ? <div>Loading...</div> : (
                            searchResult?.slice(0, 3).map(user => (
                                <ShowUsers
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}

                    </ModalBody>
                    <ModalFooter>
                        <Button color="black" bg="blue.500" onClick={() => AddUserInGroup(selectedUser)}>Add Member</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddUserToGroup
