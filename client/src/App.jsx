import { useEffect, useState } from 'react'
import axios from 'axios'
import {Outlet} from "react-router-dom"
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import './App.css'

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get('http://localhost:3000',{
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
    ) : null
}

export default App
