import React from 'react'

const IconTag = ({color, size}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 10.5V8.5H16V4.5H14V8.5H10V4.5H8V8.5H4V10.5H8V14.5H4V16.5H8V20.5H10V16.5H14V20.5H16V16.5H20V14.5H16V10.5H20ZM14 14.5H10V10.5H14V14.5Z" className={color}/>
    </svg>
    
  )
}

export default IconTag
