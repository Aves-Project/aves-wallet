import logo from './logo.svg';
import './App.css';
// import pico css
// npm install @picocss/pico
import '@picocss/pico';
import { useState } from 'react';
// Aves React Wallet
// Uses web3 to create local wallet and send transactions to https rpc
// rpc; https://rpc.avescan.io

import Wallet from './Wallet';

// sync_status from local node
// http://localhost:8545

  function App() {
    return (
      <div className="App">   
          
            
          {Wallet()}
      </div>
      
    );
  }
  
export default App;
