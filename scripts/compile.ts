import * as fs from "fs";
import process from "process";
import {Cell} from "ton-core";
import {compileFunc} from "@ton-community/func-js";

async function compileScript() {
    const compileResult = await compileFunc({
        targets: ["./contracts/main.fc"],
        sources: (x) => fs.readFileSync(x).toString("utf-8")
    });

    if(compileResult.status === 'error') {
        console.log('编译错误......')
        process.exit(1)
    }

    console.log('编译成功......')

    const hexArtifact = "build/main.compiled.json";
    fs.writeFileSync(
        hexArtifact,
        JSON.stringify({
            hex: Cell.fromBoc(Buffer.from(compileResult.codeBoc, "base64"))[0].toBoc().toString("hex")
        })
    );
}

compileScript();