import {useEffect, useState} from "react";
import {MainContract} from "../contracts/MainContract";
import {useTonClient} from "./useTonClient";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {Address, OpenedContract} from "ton-core";
import {b} from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";

export function useMainContract() {
    const client = useTonClient();
    const [contractData, setContractData] = useState<null | {
        counter_value: number;
        recent_sender: Address;
        owner_address: Address;
    }>();
    const [balance, setBalance] = useState<null | number>(0);

    const mainContract = useAsyncInitialize(async () => {
        if(!client) return;
        const contract = new MainContract(
            Address.parse("EQB8uY1gmF6z0h4I3sAFk0CP2LWRrwewnCbn7EYIaQ77y7XR")
        );
        return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);

    useEffect(() => {
        async function getValue(){
            if(!mainContract) return;
            setContractData(null);
            const val = await mainContract.getData();
            const balance = await mainContract.getBalance();
            setContractData({
                counter_value: val.number,
                recent_sender: val.recent_sender,
                owner_address: val.owner_address
            });
            setBalance(balance);
        }
        getValue();
    }, [mainContract]);
    return {
        contract_address: mainContract?.address.toString(),
        contract_balance: balance,
        ...contractData
    }
}


