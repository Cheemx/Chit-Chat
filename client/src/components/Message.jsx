import React from 'react'
import { useSelector } from 'react-redux'

function formatTime(dateString) {
    const date = new Date(dateString)
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }
    return date.toLocaleString('en-us', options)
}

function Message({message, receiver}) {
    const authUser = useSelector((state) => state.auth.userData)
    const fromMe = authUser ? message.senderId === authUser._id : false

    const formattedTime = formatTime(message.createdAt)
    const chatClassName = fromMe ? "justify-end" : "justify-start"
    const bubbleBgColor = fromMe ? "bg-cyan-500" : "bg-gray-700"
    const bubbleTextColor = fromMe ? "text-white" : "text-gray-200"
    const messageAlignment = fromMe ? "items-end" : "items-start"
    const timeTextColor = fromMe ? "text-black" : "text-gray-400"

    return (
        <div className={`flex ${chatClassName} py-2`}>
            <div className='flex items-center'>
                {!fromMe && (
                    <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center'>
                        <span>{receiver.charAt(0).toUpperCase()}</span>
                    </div>
                )}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-xs mx-2 p-2 rounded-lg shadow-md ${bubbleBgColor} ${bubbleTextColor} flex flex-col gap-1 ${messageAlignment}`}>
                <p className='text-base leading-tight'>{message.message}</p>
                <span className={`text-ws self-end italic tracking-wide ${timeTextColor}`}>
                    {formattedTime}
                </span>
            </div>

            {/* For outgoing message, avatar can be skipped */}
            {fromMe && (
                <div className='w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center'>
                    <span>{authUser.fullName.charAt(0).toUpperCase()}</span>
                </div>
            )}
        </div>
    )
}

export default Message