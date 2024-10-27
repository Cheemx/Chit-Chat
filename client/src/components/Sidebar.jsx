import React, { useEffect } from 'react'
import {useDispatch, useSelector} from "react-redux"
import axios from "axios"
import {setConversations, setSelectedConversation} from "../store/conversationSlice.js"

function Sidebar() {
    const dispatch = useDispatch()
    const {conversations, loading} = useSelector((state) => state.conversation)

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get("https://chit-chat-mcvb.onrender.com/get/users")
                dispatch(setConversations({
                    loading: false,
                    conversations: res.data.data
                }))
            } catch (error) {
                console.error('Error in fetching Conversations:', error)
                dispatch(setConversations({
                    loading: false,
                    conversations: []
                }))
            }
        }

        dispatch(setConversations({
            loading: true,
            conversations: []
        }))

        fetchConversations();
    }, [dispatch])

    const handleSelecteConversation = (conversation) => {
        dispatch(setSelectedConversation(conversation))
    }
    
    return (
        <div className='flex flex-col h-full min-w-[300px] bg-gray-900 text-white shadow-lg'>
            <h2 className='text-center text-2xl font-semibold text-cyan-500 p-5 border-b border-gray-700'>
                Chats
            </h2>
            <div className='overflow-y-auto'>
                {loading ? (
                    <p className='p-4 text-center text-gray-400'>Loading Conversations...</p>
                ) : (
                    <ul className='divide-y divide-gray-700'>
                        {conversations.length > 0 ? (
                            conversations.map((user) =>(
                                <li
                                    key={user._id}
                                    className='flex items-center justify-between p-4 hover:bg-gray-800 cursor-pointer transition-all duration-200 ease-in-out'
                                    onClick={() => handleSelecteConversation(user)}
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className='relative w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center'>
                                            <span className='text-white text-lg font-semibold'>{user.fullName.charAt(0).toUpperCase()}</span>

                                            {user.refreshToken && (
                                                <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-500'></span>
                                            )}
                                        </div>
                                        <p className='font-medium text-gray-200'>{user.fullName}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className='p-4 text-center text-gray-400'>No Conversations Available</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Sidebar