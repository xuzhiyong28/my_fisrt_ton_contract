import {Cell, Address, toNano} from "ton-core";
import {hex} from "../build/main.compiled.json";
import {Blockchain} from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import "@ton-community/test-utils";
describe("main.fc contract tests", () => {
    it("our first test", async () => {
        const codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
        const blockchain = await Blockchain.create();
        const myContract = blockchain.openContract(
            await MainContract.createFromConfig({}, codeCell)
        );

        const senderWallet = await blockchain.treasury("sender");
        console.log(`发送者: ${senderWallet.getSender().address}`)
        // 发送内部消息
        const sendMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(), toNano("0.05")); // 50 000 000
        
        expect(sendMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true
        })

        const data = await myContract.getData();
        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString())
    })
})