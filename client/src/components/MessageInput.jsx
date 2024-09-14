import React, { useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import axios from "axios"
import {setMessages} from "../store/conversationSlice.js"

function MessageInput({socket, wsConnected}) {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const {messages, selectedConversation} = useSelector((state) => state.conversation)

    const sendMessage = async () => {
        if (!message.trim()) return;
        setLoading(true)

        try {
            const res = await axios.post(
                `http://localhost:3000/send/${selectedConversation._id}`,
                {message},
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
    
            const newMessage = res.data.data
            console.log(newMessage);            
            if (!newMessage) {
                throw new Error("Failed to send message")
            }

            if (wsConnected && socket) {
                socket.send(JSON.stringify(newMessage))
            }
    
            dispatch(setMessages([...messages, newMessage]))
    
            setMessage('')
        } catch (error) {
            console.error(error.message);            
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='flex flex-col items-start p-4 bg-gray-800 text-white w-full'>
            <textarea
                className='w-full p-2 bg-gray-900 text-white border border-gray-700 rounded-md'
                rows={1}
                placeholder='Type your message...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
            />
            <button
                onClick={sendMessage}
                className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded-md ${loading ? 'opacity-50' : ''}`}
                disabled={loading}
            >
                {loading ? 'Sending...' : 'Send'}
            </button>
        </div>
    )
}

export default MessageInput