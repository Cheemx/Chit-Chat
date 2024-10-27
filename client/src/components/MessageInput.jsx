import React, { useRef, useState } from 'react'
import {AiOutlinePaperClip} from "react-icons/ai"

function MessageInput({ sendMessage, wsConnected}) {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef(null)

    const handleSend = () => {
        if (!message.trim()) return
        setLoading(true)
        sendMessage(message)
        setMessage('')
        setLoading(false)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSend()
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            console.log("File Selected:", file)            
            sendMessage('', file)
        }
    }

    return (
        <div className='w-full p-4 bg-gray-800 text-white flex items-center gap-3 border-gray-700'>
            <button
                onClick={() => fileInputRef.current.click()}
                className='p-2 rounded-full bg-gray-700 text-white hover:bg-cyan-500 focus:outline-none transition-all duration-200 shadow-md'
                title='Attach File'
            >
                <AiOutlinePaperClip  />
            </button>
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept='image/*,video/*'
                style={{display: "none"}}
            />
            <input 
                type="text" 
                className='flex-grow p-3 bg-gray-900 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring focus:ring-cyan-500 transition-all duration-200'
                placeholder='Type your message...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || !wsConnected}
            />
            <button
                onClick={handleSend}
                className={`px-4 py-2 rounded-lg bg-cyan-500 text-white font-semibold shadow-md hover:bg-cyan-600 transition-all duration-200 ${loading || !wsConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading || !wsConnected}
            >
                {loading ? 'Sending...' : 'Send'}
            </button>
        </div>
    )
}

export default MessageInput