import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

const Home = () => {
  return (
    <div className='Home'>
        <div className='HomeContainer'>
            <Sidebar/>
            <Chat/>
        </div>
    </div>
  )
}

export default Home