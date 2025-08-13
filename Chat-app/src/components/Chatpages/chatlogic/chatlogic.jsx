


export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&  // check for not last message
        (messages[i + 1].sender._id !== m.sender._id ||   // check for different user if yes then check next otherwise repeat it
            messages[i + 1].sender._id === undefined) &&   // if next user is undefined
        messages[i].sender._id !== userId
    );
};

export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&  // last message
        messages[messages.length - 1].sender._id !== userId &&    // userId is login user
        messages[messages.length - 1].sender._id     // give last message sender id
    );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);

    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;     // 33px
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};


