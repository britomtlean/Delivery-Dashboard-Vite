import React, { useState } from 'react'

const Profile = () => {
    const [cor, setCor] = useState('#000000');
  return (
      <div className='w-full h-full border border-black py-4
      flex flex-col items-center justify-start gap-4'>

        <h1>Editar</h1>

          <input className='w-[100px] h-[100px] rounded-full p-4' type="color" value={cor} onChange={(e) => setCor(e.target.value)} />
      </div>
  );
}

export default Profile
