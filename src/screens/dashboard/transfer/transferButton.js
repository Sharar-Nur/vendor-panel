import React from 'react'

function TransferButton({ name, onClick = "" }) {
  return (
    <button onClick={onClick} className="bg-[#1A202C] border-[1px] border-[#1A202C] text-white py-[5px] px-[20px] mr-4 rounded-[4px] hover:bg-white hover:border-[1px] hover:border-black hover:text-black">{name}</button>
  )
}

export default TransferButton