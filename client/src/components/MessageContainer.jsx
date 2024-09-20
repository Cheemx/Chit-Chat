import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector} from "react-redux"
import {TiMessages} from "react-icons/ti"
import {setMessages, setSelectedConversation} from "../store/conversationSlice.js"
import MessageInput from "./MessageInput.jsx"
import Messages from "./Messages.jsx"
import axios from 'axios'

function MessageContainer() {
    const dispatch = useDispatch()
    const selectedConversation = useSelector((state) => state.conversation.selectedConversation)
    const {messages} = useSelector((state) => state.conversation)
    const [wsConnected, setWsConnected] = useState(false)
    const [localMessages, setLocalMessages] = useState(messages || [])
    const [loading, setLoading] = useState(false)
    const socketRef = useRef(null)

    useEffect(() => {
        return () => dispatch(setSelectedConversation(null))
    }, [dispatch])

    useEffect(() => {
        if (selectedConversation?._id) {
            if (socketRef.current) {
                socketRef.current.close(1000, "Closing previous connection")
            }

            // Initialize websocket connection
            socketRef.current = new WebSocket(`ws://chit-chat-mcvb.onrender.com/ws/${selectedConversation._id}`)
            
            // WebSocket conn opened
            socketRef.current.onopen = () => {
                setWsConnected(true)
                console.log("WebSocket connection established.");                
            }
            
            // Message handling
            socketRef.current.onmessage = (event) => {
                const newMessage = JSON.parse(event.data)
                setLocalMessages((prevMessages) => [...prevMessages, newMessage])
                dispatch(setMessages([...localMessages, newMessage]))
                console.log("Message received on ws:", newMessage);                
            }
            
            // WebSocket conn closed
            socketRef.current.onclose = (event) => {
                setWsConnected(false)
                console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`)                
            }

            // error handling ??
            socketRef.current.onerror = (error) => {
                console.error("WebSocket Error:", error)
            }

            return () => {
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.close(1000, "Client closed Connection");
                }
            }
        }
    }, [selectedConversation?._id, dispatch])

    // Fetch initial messages on conversation select
    useEffect(() => {
        const getMessages = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`https://chit-chat-mcvb.onrender.com/${selectedConversation._id}`)
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

    // Send new message logic
    const sendMessage = async (messageContent) => {
        if (!messageContent.trim()) return;

        try {
            const res = await axios.post(
                `https://chit-chat-mcvb.onrender.com/send/${selectedConversation._id}`,
                { message: messageContent },
                { headers: { 'Content-Type': 'application/json' } }
            )

            const newMessage = res.data.data
            if (!newMessage) {
                throw new Error("Failed to send message")
            }

            if (wsConnected && socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify(newMessage))
                console.log("Message sent successfully to ws: ", newMessage);                
            } else {
                console.error("WebSocket is not open. Current state:", socketRef.current?.readyState)
            }

            setLocalMessages((prevMessages) => [...prevMessages, newMessage])
            dispatch(setMessages([...localMessages, newMessage]))

        } catch (error) {
            console.error("Error sending message:", error.message)
        }
    }

    return (
        <div className='w-full flex flex-col h-full bg-gray-900 text-white'>
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <div className='flex-1 flex flex-col h-full'>
                    <div className='px-6 py-4 bg-gray-800 flex items-center justify-between'>
                        <h2 className='text-lg md:text-xl font-bold text-cyan-400'>
                            {selectedConversation.fullName}
                        </h2>
                    </div>

                    <div className='flex-1 overflow-y-auto px-4 py-2'>
                        <Messages messages={localMessages} loading={loading} receiver={selectedConversation.fullName}/>
                    </div>

                    <div className='w-full bg-gray-800'>
                        <MessageInput sendMessage={sendMessage} wsConnected={wsConnected} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default MessageContainer

const NoChatSelected = () => {
    const userData = useSelector((state) => state.auth.userData)

    return(
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 🫡 {userData?.fullName} </p>
                <p>Select a chat to start messaging</p>
                <TiMessages className='text-3xl md:text-6xl text-center text-gray-500' />
            </div>
        </div>
    )
}