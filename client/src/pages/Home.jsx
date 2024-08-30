import React from 'react'
import {useSelector} from "react-redux"

function Home() {
    const authStatus = useSelector((state) => state.auth.status)

    return !authStatus ? (
        <div className='min-h-screen max-w-full py-8 nt-4 text-center flex flex-wrap p-2'>
            <h1 className='text-2xl font-bold text-white'>
                Jay Shree Ram
            </h1>
        </div>
    ) : (
        <div className='min-h-screen max-w-full py-8 nt-4 text-center flex flex-wrap p-2'>
            Add the homepage bhaiyaa!!!
        </div>
    )
}

export default Home