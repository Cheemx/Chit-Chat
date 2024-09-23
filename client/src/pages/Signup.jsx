import React, { useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
import {useForm} from "react-hook-form"
import toast from "react-hot-toast"
import Input from "../components/Input.jsx"
import Button from '../components/Button.jsx'

function Signup() {
    const navigate = useNavigate()
    const {register, handleSubmit, formState: { errors }} = useForm()

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(
                "https://chit-chat-mcvb.onrender.com/signup",
                data,
                {
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                }
            )    
            if (res.status === 200) {
                const userData = res.data
                if (userData) {
                    navigate("/login")
                } else {
                    console.error("No userData returned from backend!")
                }
            } else if (res.status === 400) {
                toast.error("The User already Exists!")
            } else if (res.status === 500) {
                toast.error("Internal Server Error! Please try again later")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }
    

    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='mx-auto w-full max-w-lg rounded-xl p-10 border border-blue-800/10 bg-black bg-opacity-40'>
                <h2 className='mt-2 text-center text-2xl font-bold leading-tight text-white'>
                    Sign Up to Chitchat!                    
                </h2>
                <p className='text-gray-300'>
                    Already have an Account?&nbsp;
                    <Link
                        to='/login'
                        className='font-medium text-primary transition-all duration-200 hover:underline'
                    >
                        Sign In
                    </Link>
                </p>    

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='space-y-5'>
                        <Input
                            label = "Name: "
                            placeholder = "Enter your Name"
                            type="text"
                            {...register("fullName",{
                                required: "Name is required"
                            })}
                        />
                        {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}

                        <Input
                            label = "Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
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
                            Create Account!
                        </Button>
                    </div>
                </form>         
            </div>
        </div>
    )
}

export default Signup