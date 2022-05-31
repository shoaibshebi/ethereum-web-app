import Web3 from "web3";
import { useState, useEffect } from "react";

import { loadContract } from "./utils/load-contract";
import "./App.css";

function App() {
  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
  });
  const [account, setAccount] = useState(null);
  useEffect(() => {
    const loadProvider = async () => {
      let provider = null;
      if (window.ethereum) {
        provider = window.ethereum;
        try {
          //allow access to metamask
          await provider.request({ method: "eth_requestAccounts" });
        } catch (error) {
          console.log("User denied accounts access");
        }
      } else if (window.web3) {
        provider = window.web3.currentProvider;
      } else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider("http://localhost:7545");
      }
      setWeb3Api({
        web3: new Web3(provider),
        provider,
      });
    };
    // loadProvider();
  }, []);
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
            Current Balance: <strong>10</strong> ETH
          </div>
          <button className="button is-link mr-2">Donate</button>
          <button className="button is-primary">Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
