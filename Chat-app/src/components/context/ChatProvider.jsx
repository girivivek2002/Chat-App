import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();   // this is for create context that can use everywhere in the app


const Chatprovider = ({ children }) => {
    const [user, setUser] = useState()
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState()
    const [notification, setNotification] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))  // get info which store during login or login page
        setUser(userInfo)

        if (!userInfo) {   // if usr not login
            navigate('/')
        }

    }, [navigate])


    // here we give value (value={{ user, setUser, chats, setChats, selectedChat, setSelectedChat }}) to provider it is usable to whole app we can use whenever we want just import and use
    return (
        <ChatContext.Provider value={{ user, setUser, chats, setChats, selectedChat, setSelectedChat, notification, setNotification }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {   // shortcust to use that above created context (useContext(chatContext) instead of this we use ChatState() to call it from different file)
    return useContext(ChatContext)
}

export default Chatprovider


// after that wrap app im main.jsx with Chatprovider