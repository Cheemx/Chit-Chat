import React from 'react'
import { useSelector } from 'react-redux'

function Message({message}) {
    const authUser = useSelector((state) => state.auth.userData)
    const selectedConversation = ((state) => state.conversation.selectedConversation)

    const fromMe = authUser ? message.senderId === authUser._id : false
    // const formattedTime = create extract Time function from database
    const chatClassName = fromMe ? "chat-end" : "chat-start"
    const bubbleBgColor = fromMe ? "bg-blue-500" : ""

    return (
        <div className={`chat ${chatClassName}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                </div>
            </div>
            <div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>
                {message.message}
            </div>
            <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
                {/* {formattedTime} */}
            </div>
        </div>
    )
}

export default Message