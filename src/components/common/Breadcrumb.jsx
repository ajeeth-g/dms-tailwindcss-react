import React from 'react'

const Breadcrumb = () => {
    return (
        <div className='flex items-end justify-between w-full' >
            <h1 className='text-3xl font-medium' >Add Document</h1>
            <div className="breadcrumbs text-sm">
                <ul>
                    <li><a>Home</a></li>
                    <li>Add Documents</li>
                </ul>
            </div>
        </div>
    )
}

export default Breadcrumb
