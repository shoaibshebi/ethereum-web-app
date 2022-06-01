import Web3 from "web3";
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

import { loadContract } from "./utils/load-contract";
import "./App.css";

function App() {
  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);
      console.log("cont ", contract);
      // debugger;
      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        });
      } else {
        console.log("please, install Metamask.");
      }
    };
    loadProvider();
  }, []);
  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      console.log("b ", balance);
    };
    web3Api.contract && loadBalance();
  }, [web3Api]);
  useEffect(() => {
    const getAccount = async () => {
      if (web3Api.provider) {
        const accounts = await web3Api.web3.eth.getAccounts();
        setAccount(accounts[0]);
      }
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);
  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-align-items-center">
            <span>
              <strong className="mr-2">Account: </strong>
            </span>
            {account ? (
              <div>{account}</div>
            ) : (
              <button
                className="button is-small"
                onClick={() =>
                  web3Api.provider.request({ method: "eth_requestAccounts" })
                }
              >
                Connect Wallet
              </button>
            )}
          </div>
          <div className="balance-view is-size-2 my-4">
            OBG Bal: <strong>10</strong> Users
          </div>
          <button className="button is-link mr-2">Donate</button>
          <button className="button is-primary">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
