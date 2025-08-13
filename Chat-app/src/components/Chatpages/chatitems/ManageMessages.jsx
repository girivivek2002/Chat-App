import { Avatar, Tooltip } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import { useEffect, useRef } from "react";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../chatlogic/chatlogic";


const ManageMessages = ({ messages }) => {
    const { user } = ChatState();
    const bottomRef = useRef(null);// for smoth scroll copy paste

    useEffect(() => {   // for smooth scroll it will scroll down till last div wher its ref (copy paste same as it is)
        bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [messages]);


    return (

        <div className=" p-4 rounded">
            {messages &&
                messages.map((m, i) => (
                    <div style={{ display: "flex", cursor: "pointer" }} key={m._id}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                    <Avatar
                                        mt="7px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.image}
                                    />
                                </Tooltip>
                            )}
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                    }`,
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 15px",
                                maxWidth: "75%",
                            }}

                        >
                            {m.content}
                        </span>
                    </div>
                ))}
            <div ref={bottomRef}></div>
            {/* // for smoth scroll copy paste above line */}
        </div>
    )
}

export default ManageMessages
