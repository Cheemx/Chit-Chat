import { useEffect, useState } from 'react'
import axios from 'axios'
import {Outlet} from "react-router-dom"
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import './App.css'

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get('https://chit-chat-mcvb.onrender.com/',{
            withCredentials: false
        }
        )
        .then((res) => {
            console.log("Client and Server Connected!!!")
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => setLoading(false))
    })


    return !loading ? (
        <div className='min-h-screen flex flex-col bg-black bg-opacity-10 backdrop-blur-lg'>
            <Header />
            <Outlet />
            <Footer />  
        </div>
    ) : (
        <div className='flex items-center justify-center min-h-screen bg-black'>
            <div className='w-16 h-16 border-8 border-t-cyan-500 border-gray-300 rounded-full animate-spin'></div>
        </div>
    )
}

export default App
