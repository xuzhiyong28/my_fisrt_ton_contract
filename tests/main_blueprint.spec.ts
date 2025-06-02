import {Cell, Address, toNano} from "ton-core";
import {hex} from "../build/main.compiled.json";
import {Blockchain, SandboxContract, TreasuryContract} from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import "@ton-community/test-utils";
import { compile } from "@ton-community/blueprint";

describe("main.fc contract tests", () => {

    let blockchain: Blockchain;
    let myContract: SandboxContract<MainContract>;
    let initWallet: SandboxContract<TreasuryContract>;
    let ownerWallet: SandboxContract<TreasuryContract>;
    let codeCell;
    beforeAll(async() => {
        codeCell = await compile("MainContract");
    })

    beforeEach(async() => {
        codeCell = Cell.fromBoc(Buffer.from(hex, "hex"))[0];
        blockchain = await Blockchain.create();
        initWallet = await blockchain.treasury("initAddress");
        ownerWallet = await blockchain.treasury("ownerAddress");
        myContract = blockchain.openContract(
            await MainContract.createFromConfig(
                {number: 1992, address: initWallet.address, owner_address: ownerWallet.address}, codeCell)
        );
    })

    it("One Test", async () => {
        const senderWallet = await blockchain.treasury("sender");
        console.log(`发送者: ${senderWallet.getSender().address}`);
        // 发送内部消息
        /* 
        const sendMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(), toNano("0.05")); // 50 000 000
        expect(sendMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true
        })
        const data = await myContract.getData();
        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString())
         */

        const sendMessageResult = await myContract.sendIncrementMessage(senderWallet.getSender(), toNano("0.05"), 1);
        expect(sendMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true
        })
        const data = await myContract.getDataContract();
        expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());
        expect(data.number.toString()).toBe("1993");
        const balance = await myContract.getBalance();
        console.log(`balance = ${balance.balance}`)

    })

    it("测试存入资金成功", async () => {
        const senderWallet = await blockchain.treasury("sender");
        const depositMessageResult = await myContract.sendDepositMessage(senderWallet.getSender(), toNano(5));
        expect(depositMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true
        });
        const balanceRequest = await myContract.getBalance();
        expect(balanceRequest.balance).toBeGreaterThan(toNano("4.99"));
    })

    it("测试没有指定op时存入资金判断是否错误", async () => {
        const senderWallet = await blockchain.treasury("sender");
        const depositMessageResult = await myContract.sendNoOpDepositMessage(senderWallet.getSender(), toNano(5));
        expect(depositMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: false
        });
        const balanceRequest = await myContract.getBalance();
        expect(balanceRequest.balance).toEqual(0);
    })

    it("测试提款成功", async () => {
        const senderWallet = await blockchain.treasury("sender");
        // 先给合约存款
        await myContract.sendDepositMessage(senderWallet.getSender(), toNano(5));
        /**
         * toNano("0.05") - 发送交易时携带的ton币
         * toNano("1") - 要提取1Ton
         */
        const withdrawalMessageResult =  await myContract.sendWithdrawalMessage(ownerWallet.getSender(), toNano("0.05"), toNano("1"));
        
        expect(withdrawalMessageResult.transactions).toHaveTransaction({
            from: myContract.address,
            to: ownerWallet.address,
            success: true,
            value: toNano("1")
        });
    })

    it("测试提款的时候提款人不是ownerAddress的情况失败", async () => {
        const senderWallet = await blockchain.treasury("sender");
        // 先给合约存款
        await myContract.sendDepositMessage(senderWallet.getSender(), toNano(5));
        // 使用发送者钱包senderWallet而不是ownerWallet来测试
        const withdrawalMessageResult =  await myContract.sendWithdrawalMessage(senderWallet.getSender(), toNano("0.05"), toNano("1"));
        expect(withdrawalMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: false,
            exitCode: 103 // 错误码
        });
    })

    it("测试提款但是金额不足的情况", async () => {

        const withdrawalMessageResult =  await myContract.sendWithdrawalMessage(ownerWallet.getSender(), toNano("0.5"), toNano("1"));

        expect(withdrawalMessageResult.transactions).toHaveTransaction({
            from: ownerWallet.address,
            to: myContract.address,
            success: false,
            exitCode: 104 // 错误码
        });
    })

})