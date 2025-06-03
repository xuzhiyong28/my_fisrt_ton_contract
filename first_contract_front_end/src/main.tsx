import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {TonConnectUIProvider} from "@tonconnect/ui-react";
const manifestUrl = "https://raw.githubusercontent.com/xuzhiyong28/my_fisrt_ton_contract/refs/heads/master/first_contract_front_end/tonconnect-manifest.json";
createRoot(document.getElementById('root')!).render(
    <TonConnectUIProvider manifestUrl={manifestUrl}>
        <App/>
    </TonConnectUIProvider>,
)
