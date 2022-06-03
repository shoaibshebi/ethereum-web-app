import Web3 from "web3";
import { useState, useEffect, useCallback } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

import { loadContract } from "./utils/load-contract";
import "./App.css";

function App() {
  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
    contract: null,
    isProviderLoaded: false,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false);

  const canConnectToContract = account && web3Api.contract;

  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);
  const setAccountLister = (provider) => {
    provider.on("accountsChanged", (_) => window.location.reload());
    provider.on("chainChanged", (_) => window.location.reload());

    provider._jsonRpcConnection.events.on("notification", (payload) => {
      const { method } = payload;
      if (method === "metamask_unlockStateChanged") {
        setAccount(null);
      }
    });
  };
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        //if provider found then send provider with the contract name
        const contract = await loadContract("Faucet", provider);
        setAccountLister(provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true,
        });
      } else {
        setWeb3Api((api) => ({ ...api, isProviderLoaded: true }));
        console.log("please, install Metamask.");
      }
    };
    loadProvider();
  }, []);
  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]);
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
  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);
  const withdraw = async () => {
    const { contract, web3 } = web3Api;
    const val = web3.utils.toWei("0.1", "ether");
    await contract.withdraw(val, {
      from: account,
    });
    reloadEffect();
  };

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          {web3Api.isProviderLoaded ? (
            <div className="is-flex is-align-items-center">
              <span>
                <strong className="mr-2">Account: </strong>
              </span>
              {account ? (
                <div>{account}</div>
              ) : web3Api.provider ? (
                <>
                  <div className="notification is-warning is-size-6 is-rounded">
                    Wallet is not detected!{` `}
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href="https://docs.metamask.io"
                    >
                      Install Metamask
                    </a>
                  </div>
                </>
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
          ) : (
            <p>Looking for Web3</p>
          )}
          <div className="balance-view is-size-2 my-4">
            OBG Bal: <strong>{balance}</strong> Eth
          </div>
          {!canConnectToContract ? <p>Please connect to network</p> : ""}
          <button
            disabled={!canConnectToContract}
            className="button is-link mr-2"
            onClick={addFunds}
          >
            Donate 1 eth
          </button>
          <button
            disabled={!canConnectToContract}
            className="button is-primary"
            onClick={withdraw}
          >
            Withdraw 0.1 eth
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
