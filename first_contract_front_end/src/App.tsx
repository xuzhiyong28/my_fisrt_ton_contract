import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {TonConnectButton} from "@tonconnect/ui-react"
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
        <TonConnectButton />
    </div>
  )
}

export default App
