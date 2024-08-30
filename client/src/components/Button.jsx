import React from 'react'

function Button({
    children,
    type = "button",
    bgColor = 'bg-white',
    textColor = 'text-black',
    className,
    ...props
}) {
    return (
        <button className={`px-4 py-2 rounded-full hover:bg-gray-200 ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    )
}

export default Button