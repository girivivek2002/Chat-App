

import { Box } from '@chakra-ui/react'
import SideDrawer from '../Chatpages/SideDrawer'
import Mychats from '../Chatpages/Mychats'
import ChatContent from '../Chatpages/ChatContent'
import { ChatState } from '../context/ChatProvider'
import { useState } from 'react'

const Chats = () => {
  const { user } = ChatState();    // import user from chatstate
  const [refresh, setRefresh] = useState(false)


  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box display="flex" direction="col" justifyContent="space-between" w="100%" h="90vh" >
          {user && <Mychats refresh={refresh} setRefresh={setRefresh} />}
          {user && <ChatContent refresh={refresh} setRefresh={setRefresh} />}
        </Box>
      </div>
    </>
  )
}

export default Chats


// pass refresh and set refresh because it help to make refresh all thing every change