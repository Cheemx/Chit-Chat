import React from 'react'
import { useSelector } from 'react-redux'

function Message({message, receiver}) {
    const authUser = useSelector((state) => state.auth.userData)
    const fromMe = authUser ? message.senderId === authUser._id : false

    // const formattedTime = create extract Time function from database
    const chatClassName = fromMe ? "justify-end" : "justify-start"
    const bubbleBgColor = fromMe ? "bg-cyan-500" : "bg-gray-700"
    const bubbleTextColor = fromMe ? "text-white" : "text-gray-200"
    const messageAlignment = fromMe ? "items-end" : "items-start"

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
                <span className='text-ws text-gray-400 self-end'>
                    {/* {formattedTime} */}
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