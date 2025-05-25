import {hex} from "../build/main.compiled.json";
import {Cell, Address, toNano, StateInit, beginCell, storeStateInit, contractAddress} from "ton-core";
import qrcode from "qrcode-terminal";
import qs from "qs";
import dotenv from "dotenv";
dotenv.config();
async function deployScript(){
    const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
    const dataCell = new Cell();
    const stateInit: StateInit = {
        code: codeCell,
        data: dataCell
    };

    const stateInitBuilder = beginCell();
    storeStateInit(stateInit)(stateInitBuilder);
    const stateInitCell = stateInitBuilder.endCell();

    // 也可以使用下面的方式 stateInitCell = stateInitCellTemp
    /* const stateInitCellTemp = beginCell()
        .storeBit(false)
        .storeBit(false)
        .storeMaybeRef(codeCell)
        .storeMaybeRef(dataCell)
        .storeUint(0, 1)
        .endCell() */

    // 计算地址
    const address = contractAddress(0, {code: codeCell, data: dataCell});
    console.log(`计算出的合约地址: ${address.toString()}`)

    let link = `https://${process.env.TESTNET ? "test." : ""}tonhub.com/transfer/` + address.toString({testOnly: process.env.TESTNET ? true: false}) + `?` + qs.stringify({
        text: "Deploy contract",
        amount: toNano(0.05).toString(10),
        init: stateInitCell.toBoc({idx: false}).toString("base64")
    });
    console.log(`link: ${link}`)
    qrcode.generate(link, {small: true}, (code) => {
        console.log(code)
    })
}

deployScript()
