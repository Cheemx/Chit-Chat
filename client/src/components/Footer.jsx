import React from 'react'

function Footer() {
    return (
        <footer className='bg-black bg-opacity-80 w-full py-5 text-center'>
            <div className='max-w-screen-xl mx-auto'>
                <p className='my-2'>
                    <a href="https://github.com/Cheemx" target='_blank' className='text-sky-500 no-underline mx-4 hover:text-sky-700'>
                        Github
                    </a>
                    <a href="https://leetcode.com/myself_cm_" target='_blank' className='text-sky-500 no-underline mx-4 hover:text-sky-700'>
                        LeetCode
                    </a>
                </p>
                <p className='my-2 text-white'>
                    &copy; 2024 Chitchat. All rights reserved. <br />
                    Trademarks and brands are the property of their respective owners.
                </p>
            </div>
        </footer>
    )
}

export default Footer