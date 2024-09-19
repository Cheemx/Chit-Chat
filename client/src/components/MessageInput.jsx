import React, { useState } from 'react'

function MessageInput({ sendMessage, wsConnected}) {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

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

    return (
        <div className='w-full p-4 bg-gray-800 text-white flex items-center gap-3 border-gray-700'>
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