import { Box, CloseButton } from '@chakra-ui/react'
import React from 'react'
import { FaTimes } from 'react-icons/fa'

const UserBadgeIcon = ({ user, handledelete }) => {
    return (
        <>
            <Box
                display="flex"
                background="purple"
                color="white"
                p={1}
                m={1}
                variant="solid"
                fontSize={12}
                justifyContent="center"
                alignItems="center"
                gap="3px"


            >
                {user.name}
                <FaTimes onClick={handledelete} cursor="pointer" />
            </Box>
        </>
    )
}

export default UserBadgeIcon
