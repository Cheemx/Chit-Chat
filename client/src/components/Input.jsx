import React, { useId } from 'react'

const Input = React.forwardRef(({
    label,
    type = "text",
    className = '',
    ...props
}, ref) => {
    const id = useId()
    return (
        <div className='w-full'>
            {label && 
                <label 
                    className='inline-block mb-1 pl-1'
                    htmlFor={id}
                >
                    <span className='text-base'>{label}</span>
                </label>
            }
            <input
                type={type}
                className={`px-3 py-2 rounded-lg outline-none duration-200 border w-full ${className}`}
                ref={ref}
                {...props}
                id={id}
            />
        </div>
    )
})

export default Input