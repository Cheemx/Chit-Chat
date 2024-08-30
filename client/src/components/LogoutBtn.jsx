import React from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { logout } from "../store/authSlice.js"
import Button from "./Button.jsx"

function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logouthandler = async () => {
        try {
            const res = await axios.post(
                "http://localhost:3000/logout",
                {},
                {
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    withCredentials: true
                }
            )
    
            if (res.status === 200) {
                dispatch(logout())
                navigate("/")
            } else {
                console.error("Logout Failed")
            }
        } catch (error) {
            console.error("An Erroroccurred during logout:", error)            
        }
    }
    return (
        <Button onClick={logouthandler}>
            Logout
        </Button>
    )
}

export default LogoutBtn