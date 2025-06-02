// yarn blueprint run
import {address, toNano} from "ton-core";
import {MainContract} from "../wrappers/MainContract";
import {compile, NetworkProvider} from "@ton-community/blueprint";
export async function run(provider: NetworkProvider) {
    // 主网 w3r2: UQCSOoc8TPYbwS-zOM6t9R5Msrw7P-dhL_ghgVP2o1A-2j3u
    // 主网使用number=0部署后的合约地址 EQB8uY1gmF6z0h4I3sAFk0CP2LWRrwewnCbn7EYIaQ77y7XR
    // 测试网 kQA4Zxc8GtQsXTXgOLnMDVWx-g-Ih2kfU7Z6U0dVNvpItXpt
    // 测试网使用2025部署后的合约地址： kQAMd-s5WXxfLQ5hH1ExaCOrY5FY_fmiF9djWuziCRLzCXGk
    const codeCell = await compile("MainContract");
    const myContract = MainContract.createFromConfig(
        {
            number: 0,
            address: address("UQCSOoc8TPYbwS-zOM6t9R5Msrw7P-dhL_ghgVP2o1A-2j3u"),
            owner_address: address("UQCSOoc8TPYbwS-zOM6t9R5Msrw7P-dhL_ghgVP2o1A-2j3u")
        },
        codeCell
    );
    console.log(`myContract address: ${myContract.address}`);
    const openedContract = provider.open(myContract);
    openedContract.sendDeployMessage(provider.sender(), toNano("0.05"));
    await provider.waitForDeploy(myContract.address)
}
