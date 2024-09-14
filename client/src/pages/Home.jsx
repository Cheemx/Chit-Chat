import React from 'react'
import {useSelector} from "react-redux"
import Sidebar from '../components/Sidebar'
import MessageContainer from '../components/MessageContainer'

function Home() {
    const authStatus = useSelector((state) => state.auth.status)

    return !authStatus ? (
        <div className='min-h-screen max-w-full py-8 nt-4 text-center flex flex-wrap p-2'>
            <h1 className='text-2xl font-bold text-white'>
                Jay Shree Ram
            </h1>
        </div>
    ) : (
        <div className='flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-black bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20'>
            <Sidebar />
            <MessageContainer />
        </div>
    )
}

export default Home