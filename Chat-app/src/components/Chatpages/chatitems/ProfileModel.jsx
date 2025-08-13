import React from 'react'
import { IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, Button, Avatar } from '@chakra-ui/react'
import { FaEye } from 'react-icons/fa';
import { ChatState } from '../../context/ChatProvider';

const ProfileModel = ({ user, children }) => {


    const { isOpen, onOpen, onClose } = useDisclosure();
    return (

        <>
            {children ? (<span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton display={{ base: "flex" }} icon={<FaEye className="w-5 h-5 text-gray-600" />} onClick={onOpen} aria-label="View Profile" />
            )}

            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Avatar name={user.name} src={user.image}
                            height="150px"
                            width="150px"
                            borderRadius="50%"
                            backgroundImage="center" />
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            fontFamily="Work sans"
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default ProfileModel
