import React, { useEffect, useRef } from 'react'
import MessageSkeleton from "./MessageSkeleton.jsx"
import Message from "./Message.jsx"

function Messages({ messages, loading, receiver }) {
    const lastMessageRef = useRef()

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({behavior: "smooth"})
        }
    }, [messages])

    return (
        <div className='px-4 flex-1 overflow-auto h-max-[400px] overflow-y-auto'>
            {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

            {!loading && 
                messages.length > 0 && 
                messages.map((message, index) => (
                    <div 
                        key={message.createdAt} 
                        ref={index === messages.length - 1 ? lastMessageRef : null}
                    >
                        <Message message={message} receiver={receiver}/>
                    </div>
                ))
            }

            {!loading && messages.length === 0 && (
                <p className='text-center'>Send a message to start the conversation</p>
            )}
        </div>
    )
}

export default Messages