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
                const res = await axios.get("http://localhost:3000/get/users")
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
        <div className='flex flex-col h-screen min-w-[300px]'>
            <h2 className='text-center text-xl font-bold leading-tight text-white p-4 border-b border-gray-600'>Chats</h2>

            <div className='overflow-y-auto'>
                {loading ? (
                    <p className='p-4'>Loading...</p>
                ) : (
                    <ul>
                        {conversations.length > 0 ? (
                            conversations.map((user) => (
                                <li
                                    key={user._id}
                                    className='flex items-start justify-between p-4 border-b border-gray-600 hover:bg-gray-700 cursor-pointer'
                                    onClick={() => handleSelecteConversation(user)}
                                >
                                    <p className='font-medium text-gray-200'>{user.fullName}</p>
                                </li>
                            ))
                        ) : (
                            <li>No Conversations Available</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Sidebar