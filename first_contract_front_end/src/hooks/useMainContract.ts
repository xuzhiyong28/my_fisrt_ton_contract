import {useEffect, useState} from "react";
import {MainContract} from "../contracts/MainContract";
import {useTonClient} from "./useTonClient";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {Address, OpenedContract} from "ton-core";
