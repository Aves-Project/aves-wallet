import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
// Aves React Wallet
// Uses web3 to create local wallet and send transactions to https rpc
// rpc; https://rpc.avescan.io

import Wallet from './Wallet';
  function App() {
    return (
      <div className="App">
          {Wallet()}
      </div>
    );
  }
  
export default App;
