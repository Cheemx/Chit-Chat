import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector} from "react-redux"
import {TiMessages} from "react-icons/ti"
import {setSelectedConversation} from "../store/conversationSlice.js"
import MessageInput from "./MessageInput.jsx"
import Messages from "./Messages.jsx"

let socket;

function MessageContainer() {
    const dispatch = useDispatch()
    const selectedConversation = useSelector((state) => state.conversation.selectedConversation)
    const [wsConnected, setWsConnected] = useState(false)

    useEffect(() => {
        return () => dispatch(setSelectedConversation(null))
    }, [dispatch])

    useEffect(() => {
        if (selectedConversation?._id) {
            // Initialize websocket connection
            socket = new WebSocket(`ws://localhost:3000/ws/${selectedConversation._id}`)

            // WebSocket conn opened
            socket.onopen = () => {
                setWsConnected(true)
                console.log("WebSocket connection established.");                
            }

            // WebSocket conn closed
            socket.onclose = () => {
                setWsConnected(false)
                console.log("WebSOcket connection closed")                
            }

            return () => {
                socket.close();
            }
        }
    }, [selectedConversation?._id])

    return (
        <div className='md:min-w-[450px] flex flex-col'>
            {!selectedConversation ? (
                <NoChatSelected />
            ) : (
                <>
                    <div>
                        <span>To:</span>{" "}
                        <span className='text-gray-900 font-bold'>{selectedConversation.fullName}</span>
                    </div>
                    <Messages socket={socket} />
                    <MessageInput socket={socket} wsConnected={wsConnected} />
                </>
            )}
        </div>
    )
}

export default MessageContainer

const NoChatSelected = () => {
    const authUser = useSelector((state) => state.auth.userData)

    return(
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 🫡 {authUser?.fullName} </p>
                <p>Select a chat to start messaging</p>
                <TiMessages className='text-3xl md:text-6xl text-center' />
            </div>
        </div>
    )
}