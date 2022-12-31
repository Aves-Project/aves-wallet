import { useState } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';
// import crypto-js
import { AES } from 'crypto-js';
import { CryptoJS } from 'crypto-js';
import QRCode from 'react-qr-code';
import  { enc } from 'crypto-js';
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

// Import toastify css file
export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [logedIn, setLogedIn] = useState(false);
  const [logedInState, setLogedInState] = useState(0);
  const [createdWallet, setCreatedWallet] = useState(false);

  const setTransactions = (transactions) => {
    // local storage
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }
  if (localStorage.getItem('transactions') === null) {
    setTransactions([]);
  }
  const addTransaction = (transaction) => {
    // local storage
    const transactions = localStorage.getItem('transactions');
    const newTransactions = JSON.parse(transactions);
    newTransactions.push(transaction);
    setTransactions(newTransactions);

  }
  const getTransactionsLocal = () => {
    // local storage
    let transactions = localStorage.getItem('transactions');
    if (transactions == null) {
      transactions = [];
    } else {
      transactions = JSON.parse(transactions);
    }
    return transactions;
  }

                  
  // rpc
  const [rpc, setRpc] = useState('https://rpc.avescoin.io');
  //const [rpc, setRpc] = useState('HTTP://127.0.0.1:7545 ');

  // settings
  const [settings, setSettings] = useState(false);
  // state 1 = crate new wallet
  // state 2 = import wallet

  // Create new wallet, import keypair
  const encryptWallet = async (wallet, password) => {
    var ciphertext = AES.encrypt(wallet.privateKey, password).toString();
    localStorage.setItem('wallet', ciphertext);
    console.log('wallet encrypted ' + ciphertext);
    return true;
  } 
  const decryptWallet = async (password) => {
    try {
        var bytes  = AES.decrypt(localStorage.getItem('wallet'), password);
        var hex = bytes.toString(enc.Utf8);
        const wallet = new ethers.Wallet(hex);
        setLogedIn(true);
        setWallet(wallet);
        return true;
    }
    catch (e) {
        alert('wrong password');
        return false;
    }

  }   
  const createWallet = (password) => {
    const wallet = ethers.Wallet.createRandom();
    encryptWallet(wallet, password);
    setCreatedWallet(true);
  }
  const importWallet = (privateKey, password) => {
    const wallet = new ethers.Wallet(privateKey);
    encryptWallet(wallet, password);
    setCreatedWallet(true);

  }
  const deliteWallet = () => {
    // ask are you sure
    const ask = window.confirm('Are you sure you want to delite your wallet?');
    if (ask) {
        localStorage.removeItem('wallet');
        window.location.reload();

    }
 
  }
  const lockWallet = () => {
    // ask are you sure 
    const ask = window.confirm('Are you sure you want to lock your wallet?');
    if (ask) {
        // remove wallet from state
        setWallet(null);
        setLogedIn(false);
        setSettings(false);
    }
  }
  const checkPassword = (password) => {
    // check if password is correct
    try {
        var bytes  = AES.decrypt(localStorage.getItem('wallet'), password);
        return true;
    } catch (e) {
        return false;
    }
    }
  const explortPrivateKey = () => {
    return (
        <div>
            <p>Private key: {wallet.privateKey}</p>
        </div>
    )
  }
  const copyToClipboard = (text) => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    toast.success('Copied to clipboard');
  }
  const notify = (error, message) => {
    if (error == null) {
       // orange
       toast(message)
       return;

       

    }
    if (error) {
        toast.error(message);
    } else {
        toast.success(message);
    }
  }

 
    // notification red and green
    const getBalance = async () => {
        const provider = new ethers.providers.JsonRpcProvider(rpc);
        const balance = await provider.getBalance(wallet.address);
        console.log(balance);
        // balance from big number 
        const balanceFromBigNumber = balance._hex;
        setBalance(parseInt(balanceFromBigNumber, 16));
    }
    const sendTransaction = async (to, amount) => {            
      
      notify(null, 'Transaction is sending');
      const privkey = wallet.privateKey;
      var wallet1 = new ethers.Wallet(privkey);
      const web3 = new Web3(rpc);
      const nonce = await web3.eth.getTransactionCount(wallet.address);
      const tx = {
        from: wallet.address,
        to: to,
        chainId: 33333,
        value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
        gasLimit: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
        nonce: nonce
      };
      const signed = await wallet1.signTransaction(tx);
      console.log(signed);
      try {
      const sent = await web3.eth.sendSignedTransaction(signed)
      notify(false, 'Transaction sent');
      addTransaction({  
        amount: amount,
        time: new Date().toLocaleString(),
      });
      getTransactions();

    }
      catch (e) {
        notify(true, 'Transaction failed' + e);
      }
   
      getBalance();
    }
    const getTransactions = () => {
      let tx = getTransactionsLocal();
      // if tx is empty
      if (tx.length == 0) {
         return (
            <div>
                <p>No transactions</p>
            </div>
        )
      }
      // time is in ago format
      return (
        <div>
          <h3>Lastest Withdraws</h3>
          <ul>
            {tx.slice(0, 5).map((transaction, index) => {
              // make time ago
              const time = moment(transaction.time).fromNow();
          
              return (
                <table key={index}>
                  <th>
                    <td>Amount</td>
                  </th>
                  <tr>
                    <td>{transaction.amount}</td>
                    <td>{time}</td>
                  </tr>
                </table>

              )
            }
            )}
          </ul>
        </div>
      )
    }

    // background get balance
    const backgroundGetBalance = async () => {
        // every 3 seconds update balance
        setInterval(() => {
            getBalance();
            getTransactions();
        }, 10000);
    }
    

 
  if (localStorage.getItem('wallet') != null) {
    // login
    if (!logedIn) {
    return (
        <div>
            <img src='https://cdn.discordapp.com/attachments/1014981973263011853/1036978915807338516/aves-logo.png' className="App-logo" alt="logo" height={50} />
            <h1>Unlock your wallet</h1>
            <input type="password" placeholder="password" id="l2password" />
            <button onClick={() => decryptWallet(document.getElementById('l2password').value)}>Login</button>
            <button className='red_button'
            onClick={() => deliteWallet()}>Delete wallet</button>
        </div>
    )
    } else {
        getBalance();
        backgroundGetBalance();
        // logged in
        // check if settings is open
        if (settings) {
            if (logedInState == 3) {
                return (
                    <div>
                        <button onClick={() => setLogedInState(0)}>Back</button>
                        <ToastContainer /> 

                        {explortPrivateKey()}
                        <a className="a" onClick={() => copyToClipboard(wallet.privateKey)}>Copy to clipboard</a>

                    </div>
                )
            }
            // export private key, lock wallet, delite wallet, change rpc
            return (
                <div>
                  <ul className='navbar'>
                    <ToastContainer /> 

                    <button  className='orange_button'
                     onClick={() => setSettings(false)}>Back</button>

                    <button onClick={() => lockWallet()}>Lock wallet</button>

                    <button className='red_button'
                    onClick={() => setLogedInState(3)}>Export private key</button>
                  </ul>
                    {/* <input type="text" placeholder="rpc" id="rpc" />
                    <button onClick={() => setRpc(document.getElementById('rpc').value)}>Change rpc</button>
                     */}
                  <h1><a 
                      className="a"
                  >Avescoin.io</a></h1>
                </div>
            )

            // export private key
        } 
        //             <button onClick={() => setSettings(true)}>Settings</button>

 
        // new better design
        return (
            <div>

            <ul className='navbar'>
              <li>  <button  className='orange_button' onClick={() => setSettings(true)}>Settings</button> </li>
              <li>  <button onClick={() => window.open('https://avescan.io/address/' + wallet.address, '_blank')}>View on avescan</button> </li>
              <li>  <ToastContainer /> </li>
            </ul>
            <h4><input type="text" value={wallet.address} className='address_input' style={{width: '70%'}} onClick={() => copyToClipboard(wallet.address)}/></h4>
            <h3>Balance: {(balance / 1000000000000000000).toFixed(2)} AVS</h3>
            <div id='qr_code_right' style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <QRCode value={wallet.address} 
                    size={256}
                    fgColor="#000000"
                    bgColor="#ffffff"
                    level="Q"
                    includeMargin={true}
                    />
                </div>
                <ul>
                  <li>
                    <input type="text" placeholder="to" id="to" />
                  </li>
                  <li>
                    <input type="text" placeholder="amount" id="amount" />
                  </li>
                  <li>
                    <button onClick={() => sendTransaction(document.getElementById('to').value, document.getElementById('amount').value)}>Send</button>
                  </li>
                  <li>
                  </li>
                </ul>
           </div>
        );
    }

  }
  else {
    if (logedInState === 0) {
      return (

        <div>
          <div className="App">
          <img src='https://cdn.discordapp.com/attachments/1014981973263011853/1036978915807338516/aves-logo.png' className="App-logo" alt="logo" height={5}
          />
          <p>Aves is POW coin, that donates 5% of the block reward to ECO projects.</p>
          <p>Avescoin.io</p>
          </div>
          <button onClick={() => setLogedInState(1)}>Create Wallet</button>
          <button onClick={() => setLogedInState(2)}>Import Wallet</button>
        </div>
      );
    }
    if (logedInState === 1) {
        return (
            <div>
            <img src='https://cdn.discordapp.com/attachments/1014981973263011853/1036978915807338516/aves-logo.png' className="App-logo" alt="logo" height={5} />
            <h1>Create Wallet</h1>
            <p>Enter a password to encrypt your wallet</p>
            <input type="password" id="password" name="password" placeholder='password' />
            <button onClick={() => createWallet(document.getElementById('password').value)}>Create Wallet</button>
            <button className='orange_button' onClick={() => setLogedInState(0)}>Back</button>
            </div>
        );
        }
    if (logedInState === 2) {
        return (
            <div>
            <img src='https://cdn.discordapp.com/attachments/1014981973263011853/1036978915807338516/aves-logo.png' className="App-logo" alt="logo" height={5} />
  
            <h1>Import Wallet</h1>
            <input type="text" id="privateKey" name="privateKey" placeholder="private key" />
            <input type="password" id="password1" name="password1" placeholder="password" />
            <button onClick={() => importWallet(document.getElementById('privateKey').value, document.getElementById('password1').value)}>Import Wallet</button>
            <button className='orange_button' onClick={() => setLogedInState(0)}>Back</button>

            </div>
        );
    } 
    
    
  }

}