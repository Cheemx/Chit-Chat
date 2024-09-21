import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import {useForm} from "react-hook-form"
import axios from "axios"
import {useDispatch} from "react-redux"
import {login as authLogin} from "../store/authSlice.js"
import Button from "../components/Button.jsx"
import Input from "../components/Input.jsx"

function Login() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()

    const login = async (data) => {
        try {
            const res = await axios.post(
                "https://chit-chat-mcvb.onrender.com/login",
                data,
                {
                    headers: {
                        'Content-Type' : 'appication/json'
                    }
                }
            )
    
            if (res.status === 200) {
                const userData = res.data.data    
                if (userData) {
                    dispatch(authLogin({
                        status: true,
                        userData
                    }))
                    navigate("/")
                }
            } else {
                console.error("Login Failed")
            }
        } catch (error) {
            setError(error.message)
        }
    }
    
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='mx-auto w-full max-w-lg bg-black bg-opacity-40 rounded-xl p-10 border-blue-800/10'>
                <h2 className='mt-2 text-center text-2xl font-bold leading-tight text-white'>
                    Login to Chitchat!
                </h2>
                <p className='text-gray-300'>
                    Don't have an Account?&nbsp;
                    <Link
                        to="/signup"
                        className='font-medium text-primary transition-all duration-200 hover:underline'
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}

                <form onSubmit={handleSubmit(login)}>
                    <div className='space-y-5'>
                        <Input
                            label = "Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true
                            })}
                        />
                        <Button type='submit' className='w-fit'>
                            Login
                        </Button>
                    </div>
                </form>
            </div>            
        </div>
    )
}

export default Login