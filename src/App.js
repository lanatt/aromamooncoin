import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/MemeCoin.json";

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [inputValue, setInputValue] = useState({ walletAddress: "", transferAmount: "", burnAmount: "", mintAmount: "" });
  const [tokenName, setTokenName] = useState("AromaMoon Coin");
  const [tokenSymbol, setTokenSymbol] = useState("ARMC");
  const [tokenTotalSupply, setTokenTotalSupply] = useState(1000.0);
  const [isTokenOwner, setIsTokenOwner] = useState(false);
  const [tokenOwnerAddress, setTokenOwnerAddress] = useState(null);
  const [yourWalletAddress, setYourWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  const contractAddress = '0x9e4deb5f6f6ac367a7929cdb2e976ae97b537fb8';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setYourWalletAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("Install a MetaMask wallet to get our token.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getTokenInfo = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        let tokenName = await tokenContract.name();
        let tokenSymbol = await tokenContract.symbol();
        let tokenOwner = await tokenContract.owner();
        let tokenSupply = await tokenContract.totalSupply();
        tokenSupply = utils.formatEther(tokenSupply)

        setTokenName(`${tokenName} 🦊`);
        setTokenSymbol(tokenSymbol);
        setTokenTotalSupply(tokenSupply);
        setTokenOwnerAddress(tokenOwner);

        if (account.toLowerCase() === tokenOwner.toLowerCase()) {
          setIsTokenOwner(true)
        }

        console.log("Token Name: ", tokenName);
        console.log("Token Symbol: ", tokenSymbol);
        console.log("Token Supply: ", tokenSupply);
        console.log("Token Owner: ", tokenOwner);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const transferToken = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await tokenContract.transfer(inputValue.walletAddress, utils.parseEther(inputValue.transferAmount));
        console.log("Transfering tokens...");
        await txn.wait();
        console.log("Tokens Transfered", txn.hash);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const burnTokens = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await tokenContract.burn(utils.parseEther(inputValue.burnAmount));
        console.log("Burning tokens...");
        await txn.wait();
        console.log("Tokens burned...", txn.hash);

        let tokenSupply = await tokenContract.totalSupply();
        tokenSupply = utils.formatEther(tokenSupply)
        setTokenTotalSupply(tokenSupply);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const mintTokens = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);
        let tokenOwner = await tokenContract.owner();
        const txn = await tokenContract.mint(tokenOwner, utils.parseEther(inputValue.mintAmount));
        console.log("Minting tokens...");
        await txn.wait();
        console.log("Tokens minted...", txn.hash);

        let tokenSupply = await tokenContract.totalSupply();
        tokenSupply = utils.formatEther(tokenSupply)
        setTokenTotalSupply(tokenSupply);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet to get our token.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getTokenInfo();
  }, [])

  return (
    <main className="main-container">
      <h2 className="headline">
        <span className="headline-gradient">AromaMoon Coin Project</span>        
        <a href=""><img class="imgcoin" src="https://i.ibb.co/c1qWqBJ/armc.png" alt=""/></a>
      </h2>
	  <div class="container">
        <div class="row">
          <div class="col-xxl-2 col-xl-2 col-lg-2 col-md-12 col-sm-12"></div>
          <div class="col-xxl-8 col-xl-8 col-lg-8 col-md-12 col-sm-12">
            <div class="bodytitle">
              <div class="body-info">
	  
				  <section className="customer-section px-10 pt-5 pb-10">
					{error && <p className="text-2xl text-red-700">{error}</p>}
					<div className="mt-5">
					  <span className="mr-5"><strong>Coin:</strong><span class="textname"> {tokenName}</span> <img class="imgcoinmm" src="https://i.ibb.co/c1qWqBJ/armc.png" alt=""/></span>
					  <span className="mr-5"><strong>Ticker:</strong><span class="texttname">  {tokenSymbol} </span></span>
					  <span className="mr-5"><strong>Total Supply:</strong><span class="texttname">  {tokenTotalSupply}</span></span>
					</div>
					<div className="mt-7 mb-9">
					  <form className="">
						<input
						  type="text"
						  className="form-control col-md-12 info"
						  onChange={handleInputChange}
						  name="walletAddress"
						  placeholder="Wallet Address"
						  value={inputValue.walletAddress}
						/>
						<input
						  type="text"
						  className="form-control col-md-12 infoff"
						  onChange={handleInputChange}
						  name="transferAmount"
						  placeholder={`0.0000 ${tokenSymbol}`}
						  value={inputValue.transferAmount}
						/>
						<button
						  className="btn btn-primary col-md-12"
						  onClick={transferToken}>Transfer Tokens</button>
					</form>
				</div>
				  <section className="customer-section px-10 pt-5 pb-10">
					<div className="mt-10 mb-10 burn">
					  <form className="">
						<input
						  type="text"
						  className="form-control col-md-12 info"
						  onChange={handleInputChange}
						  name="burnAmount"
						  placeholder={`0.0000 ${tokenSymbol}`}
						  value={inputValue.burnAmount}
						/>
						<button
						  className="btn btn-primary col-md-12"
						  onClick={burnTokens}>
						  Burn Tokens
						</button>
					  </form>
					</div>
					<div className="mt-10 mb-10">
					  <form className="">
						<input
						  type="text"
						  className="form-control col-md-12 info"
						  onChange={handleInputChange}
						  name="mintAmount"
						  placeholder={`0.0000 ${tokenSymbol}`}
						  value={inputValue.mintAmount}
						/>
						<button
						  className="btn btn-primary col-md-12"
						  onClick={mintTokens}>
						  Mint Tokens
						</button>
					  </form>
					</div>
				  </section>

				<div className="mt-5">
				  <p><span className="font-bold">Contract Address: </span>{contractAddress}</p>
				</div>
				<div className="mt-5">
				  <p><span className="font-bold">Token Owner Address: </span>{tokenOwnerAddress}</p>
				</div>
				<div className="mt-5">
				  {isWalletConnected && <p><span className="font-bold">Your Wallet Address: </span>{yourWalletAddress}</p>}
				  <button className="btn btn-secondary btn-lg" onClick={checkIfWalletIsConnected}>
					{isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
				  </button>
				</div>

				</section>
			</div>
		</div>
		</div>
		</div>
		</div>
    </main>
  );
}
export default App;
