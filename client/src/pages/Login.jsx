import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import {useForm} from "react-hook-form"
import axios from "axios"
import {useDispatch} from "react-redux"
import toast from "react-hot-toast"
import {login as authLogin} from "../store/authSlice.js"
import Button from "../components/Button.jsx"
import Input from "../components/Input.jsx"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: { errors }} = useForm()

    const login = async (data) => {
        try {
            const res = await axios.post(
                "https://chit-chat-mcvb.onrender.com/login",
                data,
                {
                    headers: {
                        'Content-Type' : 'application/json'
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
            } 
            if (res.status === 400) {
                const errorMessage = res.data?.message || "Invalid username or Password"

                toast.error(errorMessage)
            } 
            if (res.status === 401) {
                toast.error("No User Found!")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
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

                <form onSubmit={handleSubmit(login)}>
                    <div className='space-y-5'>
                        <Input
                            label = "Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: "Email is required!",
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Email address must be a valid address"
                                }
                            })}
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required"
                            })}
                        />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

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