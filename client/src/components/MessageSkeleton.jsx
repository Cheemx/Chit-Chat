import React from 'react'

function MessageSkeleton() {
    return (
        <>
			<div className='flex gap-3 items-center mb-4'>
				<div className='skeleton w-10 h-10 rounded-full bg-gray-600 shrink-0'></div>
				<div className='flex flex-col gap-1'>
					<div className='skeleton h-4 w-40 bg-gray-600 rounded-md'></div>
					<div className='skeleton h-4 w-40 bg-gray-600 rounded-md'></div>
				</div>
			</div>
			<div className='flex gap-3 items-center justify-end mb-4'>
				<div className='flex flex-col gap-1'>
					<div className='skeleton h-4 w-36 bg-gray-600 rounded-md'></div>
				</div>
				<div className='skeleton w-10 h-10 rounded-full bg-gray-600 shrink-0'></div>
			</div>
		</>
    )
}

export default MessageSkeleton