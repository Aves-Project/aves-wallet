import logo from './logo.svg';
// import './App.css';
import './custom.css';
// import pico css
// npm install @picocss/pico
import '@picocss/pico';
import { useState } from 'react';
// Aves React Wallet
// Uses web3 to create local wallet and send transactions to https rpc
// rpc; https://rpc.avescan.io

import Wallet from './Wallet';
import { ToastContainer } from 'react-toastify'
// sync_status from local node
// http://localhost:8545

function App() {
	return (
		<div className="App">
			<ToastContainer />
			<div className="send container-fluid overflow-y">
				<div className="row h-100">
					<div className="col-xl-3  logo-part">
			
					</div>
					{Wallet()}
				</div>
			</div>
			<img className="top-group" src="/group.png" />
			<img className="bottom-group" src="/group.png" />
		</div>

	);
}

export default App;
