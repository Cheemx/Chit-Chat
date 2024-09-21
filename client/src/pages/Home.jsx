import React from 'react'
import {useSelector} from "react-redux"
import Sidebar from '../components/Sidebar'
import MessageContainer from '../components/MessageContainer'

function Home() {
    const authStatus = useSelector((state) => state.auth.status)

    return !authStatus ? (
        <div className='min-h-screen bg-gray-900 max-w-full py-8 mt-4 text-center flex flex-col items-center justify-center p-4'>
            <h1 className='text-4xl font-bold text-white mb-6'>
                Welcome to Chitchat!
            </h1>
            <p className='text-gray-300 font-normal text-xl text-left justify-start'>
                Chitchat is a real-time chat application built with cutting-edge technology to provide fast, seamless messaging (ofcourse if you have fast internet connection). Explore the project, and if you just want to test the project feel free to do so with accounts below!
            </p>
            <br /> 

            <div className='text-left max-w-2xl mb-8'>
                <ul className='list-disc text-gray-300 pl-5'>
                    <li>
                        <span className='font-semibold'>Backend:</span> Built using Go, with gorilla/mux for the HTTP server and gorilla/websocket for real-time communication.
                    </li>
                    <li>
                        <span className='font-semibold'>Frontend:</span> Developed with ReactJS and styled with Tailwind CSS to ensure a sleek, simple yet classic design.
                    </li>
                    <li>
                        <span className='font-semibold'>Database:</span> MongoDB stores user data, messages, and conversations securely.
                    </li>
                    <li>
                        <span className='font-semibold'>Responsiveness:</span> While the app looks great on larger screens. there are ongoing improvements for mobile support.
                    </li>
                    <li>
                        <span className='font-semibold'>Contact:</span> If you encounter any issues or have suggestions, please reach out at:
                        <br /> 
                        <a 
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=chinmaymahajan999@gmail.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className='text-cyan-500 hover:underline'>
                            chinmaymahajan999@gmail.com
                        </a>
                    </li>
                </ul>
            </div>

            <div className='bg-gray-800 p-4 rounded-lg shadow-lg max-w-md'>
                <h2 className='text-xl font-bold text-white mb-2'>
                    Test Accounts:
                </h2>
                <ul className='text-gray-300'>
                    <li>
                        <span className='font-semibold'>Email:</span> one@gmail.com
                        <br />
                        <span className='font-semibold'>Password:</span> one@123
                    </li>
                    <li className='mt-4'>
                        <span className='font-semibold'>Email:</span> two@gmail.com
                        <br />
                        <span className='font-semibold'>Password:</span> two@123
                    </li>
                </ul>
            </div>       
        </div>
    ) : (
        <div className='flex flex-col sm:flex-row sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-900 bg-clip-padding'>
            <Sidebar className="sm:w-1/3 w-full"/>
            <MessageContainer className="sm:w-2/3 w-full"/>
        </div>
    )
}

export default Home