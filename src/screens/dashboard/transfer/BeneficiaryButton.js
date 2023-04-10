import React from 'react'

function BeneficiaryButton({name, width}) {
  
  return (
    <button type='submit' className="bg-[#1A202C] mt-[15px] text-white py-[12px] px-[32px] w-[93%] h-[48px] rounded-[3px] hover:bg-white hover:border-black hover:border-[1px] hover:text-black">{name}</button>
  )
}

export default BeneficiaryButton