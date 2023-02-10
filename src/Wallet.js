import { Component, useState } from 'react';
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

// import componentDidMount and componentWillUnmount
import { useEffect } from 'react';
// Import toastify css file
// export default function Wallet() extends Component {
// extend it
export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [logedIn, setLogedIn] = useState(false);
  const [logedInState, setLogedInState] = useState(0);
  const [createdWallet, setCreatedWallet] = useState(false);
  // setTx(tx);
  // setCheckedTxs(true);
  const [tx, setTx] = useState(null);
  const [checkedTxs, setCheckedTxs] = useState(false);
  const [lastTimeChecked, setLastTimeChecked] = useState(0);

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
  const [toggleModalState, setToggleModalState] = useState(false);
  const [toggleModalState2, setToggleModalState2] = useState(false);
  const toggleModal = () => {
    setToggleModalState(!toggleModalState);
  }
  const toggleModal2 = () => {
    setToggleModalState2(!toggleModalState2);
  }

  //const [rpc, setRpc] = useState('HTTP://127.0.0.1:7545 ');
  let our_walletVer = "1.0.3";
  let api = "https://api.github.com/repos/Aves-Project/aves-wallet/releases/latest";
  const [updated_ready, setUpdated_ready] = useState(false);
  const [updated_ready_check, setUpdated_ready_check] = useState(false);
  const uptoDate = () => {
    fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let latestVer = data.tag_name;
      if (latestVer != our_walletVer) {
        alert('New version available: ' + latestVer);
        setUpdated_ready(true);
      }
    });
  }
  if (updated_ready_check == false) {
    uptoDate();
    setUpdated_ready_check(true);
  }
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
        window.location.reload();
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
    localStorage.removeItem('wallet');
    window.location.reload();

    toggleModal();

  }
  const lockWallet = () => {
    // ask are you sure 
  
    setWallet(null);
    setLogedIn(false);
        
    setSettings(false);
    toggleModal();
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
      try {
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

      const sent = await web3.eth.sendSignedTransaction(signed)
      notify(false, 'Transaction sent');
      addTransaction({  
        amount: amount,
        time: new Date().toLocaleString(),
      });

    }
      catch (e) {
        notify(true, 'Transaction failed' + e);
      }
   
      getBalance();
    }
    const getTransactionsFromApi = async () => {
      const url = 'https://avescan.io/api?module=account&action=txlist&address=' + wallet.address;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setTx(data.result);
    }
    // background get balance





  if (localStorage.getItem('wallet') != null) {

    // login
    if (!logedIn) {
    // check walelt  version that was specified in package.json
    

    
    return (
        <div>
            <img src='https://cdn.discordapp.com/attachments/1014981973263011853/1036978915807338516/aves-logo.png' className="App-logo" alt="logo" height={50} />
            <article>
            <div className='grid'>
              <div>

             
              <h1>Unlock your wallet</h1>
              <input type="password" placeholder="password" id="l2password2222" 
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      decryptWallet(document.getElementById('l2password2222').value );
                    }
                  }}
                  
                  />
              
              <button class="contrast" onClick={() => decryptWallet(document.getElementById('l2password2222').value)}>Login</button>
              <button className='secondary'
              onClick={() => toggleModal()}>Delete wallet</button>
              {
                updated_ready ?
                <button className='green_button'
                onClick={() => 
                  {
                    // https://github.com/Aves-Project/aves-wallet/releases
                    window.open('https://github.com/Aves-Project/aves-wallet/releases', '_blank');
                  }
                }>Update wallet</button>
                :
                null
              
              }
             </div>
       
            </div>
            </article>
         
            {
              toggleModalState ?
              <div>
                <dialog open>
                  <article>
                    
                    <header>

                    <h3>Confirm your action!</h3>
                    <p>
                      Are you sure you want to delete your wallet?
                      Please make backup of your private key before deleting your wallet.
                    </p>
                    </header>

                    <button className ="contrast"onClick={() => toggleModal()}>No</button>
                    <button className ="secondary"onClick={() => deliteWallet()}>Yes</button>

                </article>
                  
              </dialog>

              </div>

            :
            <div></div>
            }
            
   
        </div>
    )
    
    } else {

        
        // logged in
        // check if settings is open
        if (settings) {
            if (logedInState == 3) {
                return (
                    <div>
   
                        <nav>  
                          <ul>
                            <li>   <button onClick={() => setLogedInState(0)}>Back</button> </li>

                            <li>  <ToastContainer /> </li>
                            
                          </ul>
                        </nav>
                        {explortPrivateKey()}
                        <a className="a" onClick={() => copyToClipboard(wallet.privateKey)}>Copy to clipboard</a>

                    </div>
                )
            }


            // export private key, lock wallet, delite wallet, change rpc
            return (
                <div>
    
                  <nav>  
                    <ul>
                      <li>  <button  className='orange_button' onClick={() => setSettings(false)}>Back</button> </li>
                      <li>  <button onClick={() => toggleModal()}>Lock wallet</button> </li>
                      <li>  <button className='red_button'
                      onClick={() => setLogedInState(3)}>Export private key</button> </li>
                      

                      <li>  <ToastContainer /> </li>
                      
                    </ul>
                  </nav>
                    {/* <input type="text" placeholder="rpc" id="rpc" />
                    <button onClick={() => setRpc(document.getElementById('rpc').value)}>Change rpc</button>
                     */}
                  <h1><a 
                      className="a"
                  >Avescoin.io</a></h1>
                              {
              toggleModalState ?
              <div>
                <dialog open>
                  <article>
                    
                    <header>

                    <h3>Confirm your action!</h3>
                    <p>
                      Are you sure you want to lock your wallet?
                    </p>
                    </header>

                    <button className ="contrast"onClick={() => toggleModal()}>No</button>
                    <button className ="secondary"onClick={() => lockWallet()}>Yes</button>


                </article>
                  
              </dialog>

              </div>

            :
            <div></div>
            }
                </div>
            )

            // export private key
        } 
        if (logedInState == 22) {

          return (
          <div>
          <nav>  
            <ul>
              <li>   <button onClick={() => { setLogedInState(0); setCheckedTxs(false); }}>Back</button> </li> 

              <li>  <ToastContainer /> </li>
              
            </ul>
          </nav>
          <table>
  
            {
              tx.map((tx, index) => {
                let time = new Date(tx.timeStamp * 1000).toLocaleString();
                // make time like 1 day ago
                time = moment(time).fromNow();
                return (
                  <article>
                  <tr key={index}>
                    <td>{tx.value / 1000000000000000000} AVES</td>
                    <td>
                      { 
                        (wallet.address).toLowerCase() == (tx.from).toLowerCase() ?
                         <td>
                          <img src='https://cdn-icons-png.flaticon.com/512/608/608336.png'  alt="logo" height={20} width={20} />
                        </td>
                        :
                        <td>
                          <img src='https://cdn-icons-png.flaticon.com/512/9347/9347206.png'  alt="logo" height={20} width={20} />
                        </td>
                      }
                    </td>
                    <td>{time}</td>

                    <td>
                      <a href={'https://avescan.io/tx/' + tx.hash} target="_blank">View on Avescan</a>
                    </td>
                    
                  </tr>
                  </article>
                )
              })
            }
        

    
          
          </table>
          </div>



          
          )
      }

        // check create interval to refresh page
        getTransactionsFromApi();
        getBalance();
        return (
            <div>

            <nav>  
              <ul>
                <li>  <button  className='orange_button' onClick={() => setSettings(true)}>Settings</button> </li>
                <li>  <button onClick={() => setLogedInState(22)}>Transactions</button> </li>

                <li>  <ToastContainer /> </li>
              </ul>
            </nav>
            <h4><input type="text" value={wallet.address} className='address_input' style={{width: '70%'}} onClick={() => copyToClipboard(wallet.address)}/> 
            <a
            
              onClick={() => toggleModal()}
              >
                QRCode
            </a></h4>
            {
              toggleModalState ?
              <div>
                <dialog open>
                  <article>
                    
                    <header>
                    <a href="#close"
                      aria-label="Close"
                      class="close"
                      data-target="qrcode"
                      onClick={() => toggleModal()}>
                    </a>
                    QRCode
                    </header>
                    <div id='qr_code_right' style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <QRCode value={wallet.address} 
                        size={256}
                        fgColor="#000000"
                        bgColor="#ffffff"
                        level="Q"
                        includeMargin={true}
                        />
                    </div>
                </article>
                  
              </dialog>

              </div>

            :
            <div></div>
            }

            <h3>Balance: {(balance / 1000000000000000000).toFixed(2)} AVS</h3>

       
            <article>
            <input type="text" placeholder="to" id="to" />
            <input type="text" placeholder="amount" id="amount" />
            <button onClick={() => toggleModal2()}>Send</button>
            {
              toggleModalState2 ?
              <div>
                <dialog open>
                  <article>
                    <header>
                      Are you sure you want to send {document.getElementById('amount').value} AVES to {document.getElementById('to').value}?
                    </header>
                    <button 
                    class = "secondary"
                    onClick={() => toggleModal2()}>No</button>
                    <button 
                    class = "contrast"
                    onClick={() => sendTransaction(document.getElementById('to').value, document.getElementById('amount').value)}>Yes</button>
                  </article>

                </dialog>
              </div>
              :
              <div></div>


            }
            </article>
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