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

                {message.type === "text" && (
                    <p className='text-base leading-tight'>{message.message}</p>
                )}

                {message.type === "file" && message.fileType && (
                    <>
                        {message.fileType.startsWith("image") && (
                            <div className="relative">
                                <img 
                                    src={message.fileUrl} 
                                    alt="Sent image"
                                    className="rounded-lg max-h-60 object-cover cursor-pointer" 
                                    loading="lazy"
                                    onClick={() => window.open(message.fileUrl, "_blank")}
                                />
                            </div>
                        )}
                        {message.fileType.startsWith("video") && (
                            <div className="relative cursor-pointer">
                                <video 
                                    src={message.fileUrl}
                                    controls
                                    className="rounded-lg max-h-60 object-cover"
                                    preload="metadata"
                                    muted
                                />

                                {/* Play icon overlay to open video in a new tab */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center"
                                    onClick={() => window.open(message.fileUrl, "_blank")}
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-12 w-12 text-white opacity-90" 
                                        viewBox="0 0 24 24" 
                                        fill="currentColor"
                                    >
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>
                            </div>
                        )}
                    </>
                )}


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