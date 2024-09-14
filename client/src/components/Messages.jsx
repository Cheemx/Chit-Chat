import React, { useEffect, useRef, useState } from 'react'
import {useSelector, useDispatch} from "react-redux"
import {setMessages} from "../store/conversationSlice.js"
import MessageSkeleton from "./MessageSkeleton.jsx"
import Message from "./Message.jsx"
import axios from 'axios'

function Messages({ socket }) {
    const [loading, setLoading] = useState(false)
    const[localMessages, setLocalMessages] = useState([])
    const dispatch = useDispatch()
    const {messages, selectedConversation} = useSelector((state) => state.conversation)
    const lastMessageRef = useRef()

    useEffect(() => {
        setLocalMessages(messages);
    }, [messages])

    useEffect(() => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.onmessage = (event) => {
                const newMessage = JSON.parse(event.data)
                console.log("Received WebSocket message:", newMessage);    
                
                setLocalMessages(prevMessages => [...prevMessages, newMessage])
                dispatch(setMessages([...localMessages, newMessage]))
                console.log("Updated messages:", localMessages)
            }
        }

        return () => {
            if (socket?.readyState === WebSocket.OPEN) {
                socket.close()
            }
        }
    }, [socket, dispatch, localMessages])

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)

            try {
                const res = await axios.get(`http://localhost:3000/${selectedConversation._id}`)
                dispatch(setMessages(res.data.data))
                setLocalMessages(res.data.data)
            } catch (error) {
                console.error(error.response?.data?.error || error.message)                
            } finally {
                setLoading(false)
            }
        }

        if (selectedConversation?._id) {
            getMessages()
        }
    }, [selectedConversation?._id, dispatch])

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior : "smooth"})
        }, 100)
    }, [localMessages])

    return (
        <div className='px-4 flex-1 overflow-auto h-max-[400px] overflow-y-auto'>
            {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

            {!loading && 
                localMessages.length > 0 && 
                localMessages.map((message, index) => (
                    <div 
                        key={message.createdAt} 
                        ref={index === localMessages.length - 1 ? lastMessageRef : null}
                    >
                        <Message message={message} />
                    </div>
                ))
            }

            {!loading && localMessages.length === 0 && (
                <p className='text-center'>Send a message to start the conversation</p>
            )}
        </div>
    )
}

export default Messages