import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {TonConnectButton} from "@tonconnect/ui-react"
import {useMainContract} from "./hooks/useMainContract";
function App() {
  const [count, setCount] = useState(0);
  const [
      contract_address,
      counter_value,
      recent_sender,
      owner_address,
      contract_balance
  ] = useMainContract();
  return (
    <div className='App'>
        <TonConnectButton />
    </div>

  )
}

export default App
