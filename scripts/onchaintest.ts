import {Address, Cell, contractAddress, toNano} from "ton-core";
import {hex} from "../build/main.compiled.json";
import {getHttpV4Endpoint} from "@orbs-network/ton-access";
import {TonClient4} from "ton";
import qrcode from "qrcode-terminal";
import qs from "qs";
import dotenv from "dotenv";
dotenv.config();
async function onChainTestScript() {
    const codeCell = Cell.fromBoc(Buffer.from(hex, 'hex'))[0];
    const dataCell = new Cell();
    const address = contractAddress(0, {code: codeCell, data: dataCell})
    const endpoint = await getHttpV4Endpoint({network: process.env.TESTNET ? "testnet" : "mainnet"})
    const client4 = new TonClient4({endpoint});
    const lastBlock = await client4.getLastBlock();
    let account = await client4.getAccount(lastBlock.last.seqno, address);
    console.log(`合约信息: ${account}`)
    if (account.account.state.type != 'active') {
        console.log("合约未激活")
        return;
    }
    let link = `https://${process.env.TESTNET ? "test.": ""}tonhub.com/transfer/` + address.toString({testOnly: true}) + `?` + qs.stringify({
        text: "Simple test transaction",
        amount: toNano(0.005).toString(10)
    });
    console.log(`link: ${link}`)
    qrcode.generate(link, {small: true}, (code) => {
        console.log(code)
    })

    let recent_sender_address: Address;
    setInterval(async () => {
        const lastBlock = await client4.getLastBlock();
        const {exitCode, result} = await client4.runMethod(lastBlock.last.seqno, address, "get_the_latest_sender");
        if(exitCode !== 0) {
            console.log("Running getter method failed")
            return;
        }
        if(result[0].type !== 'slice') {
            console.log("Unknown result type");
            return;
        }
        let most_recent_sender = result[0].cell.beginParse().loadAddress();

    }, 2000)

}

onChainTestScript()
