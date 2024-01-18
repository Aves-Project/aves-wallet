import { Component, useState } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';
// import crypto-js
import { AES } from 'crypto-js';
import { CryptoJS } from 'crypto-js';
import QRCode from 'react-qr-code';
import { enc } from 'crypto-js';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { useEffect } from 'react';
import QRcodeScanner from './QRcodeScanner'; // Adjust the path to your component file

// Import toastify css file
// export default function Wallet() extends Component {
// extend it
export default function Wallet() {
	const [balance, setBalance] = useState(0);
	const [wallet, setWallet] = useState();
	const [logedIn, setLogedIn] = useState(false);
	const [logedInState, setLogedInState] = useState(33333);  //33333
	const [createdWallet, setCreatedWallet] = useState(false);
	const [selected, setSelected] = useState("environment");
	const [startScan, setStartScan] = useState(false);
	const [loadingScan, setLoadingScan] = useState(false);
	const [data, setData] = useState("");
	const [oneTImeAAA, setOneTImeAAA] = useState(false);
	const [oneTIME, setOneTIME] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState('en-US');


	const handleLanguageChange = (newLanguage) => {
		setSelectedLanguage(newLanguage);
	};
	const [stakeContract, setStakeContract] = useState("0x75fA5fecE2A9783e28856c1A7EA3Af544690ebc8");
	const [stakeContractAbi, setStakeContractAbi] = useState([{ "type": "constructor", "inputs": [] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }], "name": "calculate_reward", "inputs": [{ "type": "address", "name": "_staker_address", "internalType": "address" }] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }], "name": "calculate_reward_test", "inputs": [{ "type": "uint256", "name": "staked_amount", "internalType": "uint256" }, { "type": "uint256", "name": "blocks_since_stake", "internalType": "uint256" }] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "change_owner", "inputs": [{ "type": "address", "name": "_new_owner", "internalType": "address" }] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }], "name": "check_balance", "inputs": [] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }], "name": "check_block_number", "inputs": [] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }], "name": "check_reward", "inputs": [] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }], "name": "check_staked", "inputs": [] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }], "name": "limit", "inputs": [] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "address", "name": "", "internalType": "address" }], "name": "owner", "inputs": [] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "", "internalType": "uint256" }], "name": "percentage_per_30000_blocks", "inputs": [] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "premature_withdraw", "inputs": [] }, { "type": "function", "stateMutability": "payable", "outputs": [], "name": "stake", "inputs": [] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "uint256", "name": "amount", "internalType": "uint256" }, { "type": "uint256", "name": "block_number", "internalType": "uint256" }, { "type": "address", "name": "staker_address", "internalType": "address" }, { "type": "uint256", "name": "reward", "internalType": "uint256" }], "name": "stakers", "inputs": [{ "type": "address", "name": "", "internalType": "address" }] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "start_staking", "inputs": [] }, { "type": "function", "stateMutability": "view", "outputs": [{ "type": "bool", "name": "", "internalType": "bool" }], "name": "stop", "inputs": [] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "stop_staking", "inputs": [] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "withdraw", "inputs": [] }, { "type": "function", "stateMutability": "nonpayable", "outputs": [], "name": "withdraw_aves", "inputs": [{ "type": "uint256", "name": "_amount", "internalType": "uint256" }] }, { "type": "receive" }]);
	// WEB3 COMS
	const [logedInStateWeb3, setlogedInStateWeb3] = useState(0);


	const [web3Contract, setWeb3Contract] = useState("0x4b6e4fa2aed3468c947bf3bfea70c7b3593fa5a8");
	const [Web3Abi, setWeb3Abi] = useState([{ "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "emails", "outputs": [{ "internalType": "string", "name": "body", "type": "string" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "bool", "name": "sender", "type": "bool" }, { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "feeReceiver", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_email", "type": "address" }], "name": "getInbox", "outputs": [{ "components": [{ "internalType": "string", "name": "body", "type": "string" }, { "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "bool", "name": "sender", "type": "bool" }, { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "internalType": "struct EMail.Email[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_email", "type": "address" }, { "internalType": "string", "name": "_body", "type": "string" }], "name": "sendToAddr", "outputs": [], "stateMutability": "payable", "type": "function" }]);
	const [toAddress, setToAddress] = useState('');
	const [emailBody, setEmailBody] = useState('');
	const [emailHeader, setEmailHeader] = useState('');

	const [attachmentList, setAttachmentList] = useState([]);

	const [addAddressBook, setAddAddressBook] = useState(false)
	const [openAddressBook, setOpenAddressBook] = useState(false)

	const addAttachmentToList = (fileName) => {
		setAttachmentList((prevList) => [...prevList, fileName]);
	};

	const removeAttachment = (fileName) => {
		setAttachmentList((prevList) => prevList.filter((item) => item !== fileName));
	};
	// INBOX/OUTBOX
	const [inboxList, setInboxList] = useState([]);
	const [selectedEmail, setSelectedEmail] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);

	const openEmailModal = (email) => {
		setSelectedEmail(email);
		setModalVisible(true);
		console.log(email)
	};

	const closeEmailModal = () => {
		setSelectedEmail(null);
		setModalVisible(false);
	};
	// SEARCH 
	const [searchQuery, setSearchQuery] = useState('');

	// Function to handle search input change
	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	// Filter inboxList based on the search query
	// let filteredInboxList = inboxList
	const filteredInboxList = inboxList.filter(
		(email) =>
			email[4].header.toLowerCase().includes(searchQuery.toLowerCase())
	);
	// console.log(filteredInboxList)
	// address b ook
	const [addressBook, setAddressBook] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [recipientAddress, setRecipientAddress] = useState('');

	// Load address book from local storage on component mount
	useEffect(() => {
		const storedAddressBook = JSON.parse(localStorage.getItem('addressBook')) || [];
		setAddressBook(storedAddressBook);
	}, []);

	// Save address book to local storage whenever it changes
	useEffect(() => {
		localStorage.setItem('addressBook', JSON.stringify(addressBook));
	}, [addressBook]);

	// Add a new entry to the address book
	const [recipientName, setRecipientName] = useState("")
	const addToAddressBook = () => {
		if (recipientName && recipientAddress) {
			setAddressBook([...addressBook, { name: recipientName, address: recipientAddress }]);
			setRecipientAddress('');
			setRecipientName("")
			setAddAddressBook(false)
			toast.success("Added successfully!")
		}
	};
	const addToAddressBookInput = (recipientAddress_) => {
		// setAddAddressBook()
		const recipientName = window.prompt('Enter recipient name:');
		if (recipientName && recipientAddress_) {
			setAddressBook([...addressBook, { name: recipientName, address: recipientAddress_ }]);
			toast.success("Added successfully!")
		}
	};
	// Remove an entry from the address book
	const removeFromAddressBook = (index) => {
		const updatedAddressBook = [...addressBook];
		updatedAddressBook.splice(index, 1);
		setAddressBook(updatedAddressBook);
	};

	// Filter address book based on search term
	// Filter address book based on search term
	const filteredAddressBook = addressBook.filter(
		(entry) =>
			entry.name.toLowerCase().includes(recipientAddress.toLowerCase()) ||
			entry.address.toLowerCase().includes(recipientAddress.toLowerCase())
	);


	const onNewScanResult = (decodedText, decodedResult) => {
		// handle decoded results here
		console.log(`decodedText`, decodedText);
	};
	const handleScan = async (scanData) => {
		setLoadingScan(true);
		console.log(`loaded data data`, scanData);
		if (scanData && scanData !== "") {
			console.log(`loaded >>>`, scanData);
			setData(scanData);
			setStartScan(false);
			setLoadingScan(false);
			// setPrecScan(scanData);
		}
	};
	const handleResult = (result) => {
		console.log(`result`, result);
		if (result == null) {
			// ask for camera permission
			navigator.getWebcam = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
			if (navigator.mediaDevices.getUserMedia) {
				navigator.mediaDevices.getUserMedia({ audio: true, video: true })
					.then(function (stream) {
						//Display the video stream in the video object
					})
					.catch(function (e) { console.log(e.name + ": " + e.message); });
			}
			else {
				navigator.getWebcam({ audio: true, video: true },
					function (stream) {
						//Display the video stream in the video object
					},
					function () { console.log("Web cam is not accessible."); });
			}
		}
	};
	const handleError = (err) => {
		console.error(err);
	};
	// ask for camera permission
	// setTx(tx);
	// setCheckedTxs(true);
	let our_walletVer = "1.1.0";
	let api = "https://api.github.com/repos/Aves-Project/aves-wallet/releases/latest";
	const [updated_ready, setUpdated_ready] = useState(false);
	const [updated_ready_check, setUpdated_ready_check] = useState(false);

	const [tx, setTx] = useState(null);
	const [checkedTxs, setCheckedTxs] = useState(false);
	const [lastTimeChecked, setLastTimeChecked] = useState(0);

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

	// qr code read
	const [qrCodeRead, setQrCodeRead] = useState(null);
	const handleRead = (code) => {
		setQrCodeRead(code.data);
	};
	const [isWalletCreatedAfter, setIsWalletCreatedAfter] = useState(false);
	// rpc
	const [rpc, setRpc] = useState('https://rpc.avescoin.io');
	const [toggleModalState, setToggleModalState] = useState(false);
	const [toggleModalState2, setToggleModalState2] = useState(false);
	const [toggleModalState3, setToggleModalState3] = useState(false);
	const [toggleModalState4, setToggleModalState4] = useState(false);
	const [toggleModalState5, setToggleModalState5] = useState(false);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const element = document.getElementById('to');
			if (toggleModalState4 && element && element.value !== '') {
				setRecipientAddress(element.value)
				setToggleModalState4(false);
			}
		}, 1000); // Change the interval duration (in milliseconds) according to your needs

		// Clean up the interval on component unmount
		return () => {
			clearInterval(intervalId);
		};
	}, [toggleModalState4]); // Run the effect whenever toggleModalState4 changes

	const toggleModal = () => {
		setToggleModalState(!toggleModalState);
	}
	const toggleModal2 = () => {
		setToggleModalState2(!toggleModalState2);
	}

	const toggleModal3 = () => {
		setToggleModalState3(!toggleModalState3);
	}
	const toggleModal5 = () => {

		setToggleModalState5(!toggleModalState5);
	}
	const toggleModal4 = () => {
		if (toggleModalState4 == false) {
			document.getElementById('to').value = ""; // Replace YOUR_ELEMENT_ID with the actual ID of the element you want to monitor

		}
		console.log(toggleModalState4)

		setToggleModalState4(!toggleModalState4);
	}
	const afterWalletCreated = () => {
		// wallet_create_ local storage
		localStorage.setItem('wallet_create_', false);
		setLogedInState(33333);
	}
	// reset
	const resetWallet = () => {
		localStorage.removeItem('wallet_create_');
	}
	const isWalletCreated = () => {
		// wallet_create_ local storage
		console.log('wallet_create_', localStorage.getItem('wallet_create_'));
		setIsWalletCreatedAfter(localStorage.getItem('wallet_create_'));


	}
	const setWalletCreated = () => {
		// wallet_create_ local storage
		localStorage.setItem('wallet_create_', true);
		setIsWalletCreatedAfter(true);
		isWalletCreated()
	}



	//const [rpc, setRpc] = useState('HTTP://127.0.0.1:7545 ');

	const [settings, setSettings] = useState(false);
	// state 1 = crate new wallet
	// state 2 = import wallet

	// Create new wallet, import keypair
	const encryptWallet = async (wallet, password) => {
		if (password.length == 0) {
			toast.error('Password is not valid');
			return false;
		}
		var ciphertext = AES.encrypt(wallet.privateKey, password).toString();
		localStorage.setItem('wallet', ciphertext);
		console.log('wallet encrypted ' + ciphertext);
		return true;
	}
	const decryptWallet = async (password) => {
		if (password.length == 0) {
			toast.error('Password is not valid');
			return false;
		}
		try {
			var bytes = AES.decrypt(localStorage.getItem('wallet'), password);
			var hex = bytes.toString(enc.Utf8);
			const wallet = new ethers.Wallet(hex);
			setLogedIn(true);
			setWallet(wallet);
			return true;
		}
		catch (e) {
			toast.error('Password is not valid');
			setTimeout(() => {
				// window.location.reload();
			}, 3000)
			return false;
		}

	}
	const createWallet = (password) => {
		if (password.length == 0) {
			toast.error('Password is not valid');
			return false;
		}
		const wallet = ethers.Wallet.createRandom();
		encryptWallet(wallet, password);
		setCreatedWallet(true);
		afterWalletCreated();
	}


	const importWallet = (privateKey, password) => {
		if (password.length == 0) {
			toast.error('Password is not valid');
			return false;
		}
		const wallet = new ethers.Wallet(privateKey);
		encryptWallet(wallet, password);
		setCreatedWallet(true);
		afterWalletCreated();

	}
	const deliteWallet = () => {
		// ask are you sure
		localStorage.removeItem('wallet');
		resetWallet();
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
	// ... (previous state variables)

	// Function to handle file upload



	const handleFileUpload = (e) => {
		const files = e.target.files;
		const fileNamesTable = document.getElementById('fileNamesTable');
		const tableBody = fileNamesTable.querySelector('tbody');

		// Clear previous file names
		tableBody.innerHTML = '';

		// // Display file names in the table
		// Array.from(files).forEach((file) => {
		//   const row = tableBody.insertRow();
		//   const cell = row.insertCell();
		//   cell.textContent = file.name;
		// });

		// Show the file names table
		fileNamesTable.style.display = 'table';
	};

	// Function to handle file upload button
	const handleUploadButton = () => {
		// Get the selected files from the input
		const files = document.getElementById('attachments').files;

		// Add files to the attachments list
		Array.from(files).forEach((file) => {
			addAttachmentToList(file.name);
		});
		let formData = new FormData();

		// Loop through the selected files and add them to the form data
		for (let i = 0; i < files.length; i++) {
			formData.append('files', files[i]);
		}

		// Create an XMLHttpRequest object
		let xhr = new XMLHttpRequest();

		// Open the connection to the server
		xhr.open('POST', 'https://web3.avescoin.io/upload/upload/multiple', true);

		// Send the form data
		xhr.send(formData);

		// Handle the response from the server
		xhr.onload = function () {
			if (xhr.status === 200) {
				let response = JSON.parse(xhr.responseText);
				toast.success(response.message);
				// Assuming response.attachmentLinks is an array of links to the uploaded files
				//displayFileNames(response.files.map(file => file.filename));


			} else {
				toast.error('Something went wrong. Please try again.');
			}
		}
	};
	const download = (file) => {
		// Get the selected files from the input
		let fileName = file;

		// Create a FormData object to store the files
		let formData = new FormData();

		// Loop through the selected files and add them to the form data
		formData.append('file-name', fileName);

		// Create an XMLHttpRequest object
		let xhr = new XMLHttpRequest();

		// Open the connection to the server
		xhr.open('GET', `https://web3.avescoin.io/upload/download?name=${fileName}`, true);

		// Set the responseType to 'blob' to handle binary data
		xhr.responseType = 'blob';

		// Set up onload event to handle the download
		xhr.onload = function () {
			if (xhr.status === 200) {
				// Create a blob from the response
				let blob = xhr.response;

				// Create a temporary URL for the blob
				let url = window.URL.createObjectURL(blob);

				// Create an anchor element for downloading
				let downloadLink = document.createElement('a');
				downloadLink.href = url;
				downloadLink.download = fileName; // Set the desired file name for download

				// Append the download link to the body and trigger the download
				document.body.appendChild(downloadLink);
				downloadLink.click();

				// Clean up: remove the temporary URL and the download link
				window.URL.revokeObjectURL(url);
				document.body.removeChild(downloadLink);
			} else {
				// Handle errors
				console.error('Failed to download file');
			}
		};

		// Send the form data
		xhr.send(formData);
	};
	const loadInbox = async () => {
		try {
			// Create a wallet instance using the private key
			const _wallet = new ethers.Wallet(wallet.privateKey);

			// Connect to your Ethereum provider
			const provider = new ethers.providers.JsonRpcProvider(rpc);

			// Connect the wallet to the provider
			const connectedWallet = _wallet.connect(provider);

			// Create the "AUTH" message
			const messageToVerify = "AUTH";

			// Sign the "AUTH" message
			const signature = await connectedWallet.signMessage(messageToVerify);

			// Send the signature to the server for verification
			const response = await fetch('https://web3.avescoin.io/sign_message', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					message_to_sign: messageToVerify,
					signature: signature,
				}),
			});

			// Handle the response from the server
			if (response.ok) {
				const data = await response.json();

				let inbox = data.inbox;

				// Parse JSON in the first element of each email
				const parsedInbox = inbox
					.map(email => {
						try {
							const parsedData = JSON.parse(email[0]);
							// Assuming parsedData is an array and you want the first element
							const firstElement = Array.isArray(parsedData) ? parsedData[0] : parsedData;
							return { ...email, parsedData: firstElement };
						} catch (error) {
							// Handle the error or log it
							console.error(`Error parsing email: ${email[0]}`);
							// If you want to skip the errored email, return undefined
							return undefined;
						}
					})
					.filter(email => email !== undefined); // Remove undefined entries (errored emails)

				const inboxArray = parsedInbox.map(email => {
					try {
						// Do something with each parsed email, e.g., log it or process it further
						console.log(Object.values(email));
						return Object.values(email)
					} catch (error) {
						// Handle the error or log it
						console.error(`Error processing email: ${email[0]}`);
					}
				});



				inboxArray.sort((a, b) => b[1] - a[1]);
				console.log(inboxArray)
				// Set inbox list to state
				setInboxList(inboxArray);



			} else {
				const errorData = await response.json();
				console.error("Error:", errorData.error);
				toast.error('Error verifying the signature: ' + errorData.error);
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error('Error signing the "AUTH" message.');
		}
	};
	// ... (other functions)

	const sendEmail = async () => {
		try {
			toggleModal5();
			// Assuming attachments are added to attachmentLinks array
			const attachments = attachmentList;

			// Encrypt email body, headers, and attachment links using a backend service
			const encryptedData = await encryptEmail(
				JSON.stringify({ body: emailBody, header: emailHeader, attachment_links: attachments }),
				toAddress
			);

			// Example: Use web3Contract to interact with your contract
			const contractAddress = web3Contract; // Replace with your contract address
			const CONTRACT_ABI = Web3Abi; // Replace with your contract ABI
			const privkey = wallet.privateKey;
			var provider = new ethers.providers.JsonRpcProvider(rpc);
			var wallet1 = new ethers.Wallet(privkey, provider);
			var contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet1);
			// Example: Accessing provider to get blockchain information



			// Display a loading modal or spinner here if needed
			// const modal = document.getElementById("myModal");
			// modal.style.display = "block";

			// Send the transaction
			const transaction = await contract.sendToAddr(toAddress, encryptedData.encrypted_string, {
				value: ethers.utils.parseEther('0.1'), // 5 ETH in Wei, adjust as needed
			});

			// Wait for the transaction to be mined

			await transaction.wait();

			// Hide the loading modal or spinner
			// modal.style.display = "none";

			// Display success message
			notify(false, 'Email is sent!');
			toggleModal5();
			setToggleModalState5(false);
			// Clear form fields and attachments list
			setToAddress('');
			setEmailBody('');
			setEmailHeader('');
			document.getElementById('to').value = '';
			setRecipientAddress('');
			// Clear attachments list in the UI
			setAttachmentList([]);

			// Clear attachment links array
			setlogedInStateWeb3(0)
			loadInbox();


		} catch (error) {
			console.error(error);
			notify(true, 'Failed to send email.');
			toggleModal5();

		} finally {
			// ... (any cleanup or state resetting logic)
		}
		toggleModal5();
	};

	// Function to encrypt email using a backend service
	const encryptEmail = async (emailData, toAddress) => {
		try {
			const response = await fetch('https://web3.avescoin.io/encrypt', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					string: emailData,
					to_address: toAddress,
				}),
			});

			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
			throw new Error('Failed to encrypt email.');
		}
	};

	const checkPassword = (password) => {
		// check if password is correct
		try {
			var bytes = AES.decrypt(localStorage.getItem('wallet'), password);
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
	// check create interval to refresh page
	const bgCheck = () => {
		getTransactionsFromApi();
		getBalance();
		setLastTimeChecked(Date.now());
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
		toggleModal2();
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
		getTransactionsFromApi();
	}
	const [stakeRWD, setStakeRWD] = useState(0);
	// const getStakeReward = async () => {
	//   // ethers js
	//   const provider = new ethers.providers.JsonRpcProvider(rpc);
	//   const contract = new ethers.Contract(stakeContract, stakeContractAbi, provider);
	//   try {
	//     const reward = await contract.check_reward();
	//     const rewardFromBigNumber = reward._hex;

	//     console.log(reward);
	//   } catch (e) {
	//     notify(true, 'You have need to stake first');
	//     console.log(e);
	//   }
	// }
	//https://avescan.io/api/eth-rpc
	const [blockStaked, setBlockStaked] = useState(0);
	// curr
	const [currBlock, setCurrBlock] = useState(0);
	const getStakeReward = async () => {
		if (stakeRWD == "pending") {
			return;
		}
		// use avescan api
		const url = 'https://avescan.io/api?module=account&action=txlist&address=' + wallet.address;
		// filter only stake contract
		const txs = await fetch(url);
		const txsJson = await txs.json();
		// sort by block
		txsJson.result.sort((a, b) => (a.blockNumber > b.blockNumber) ? 1 : -1);
		setStakeRWD(0);
		for (let i = 0; i < txsJson.result.length; i++) {
			const tx = txsJson.result[i];
			if (tx.to.toLowerCase() == stakeContract.toLowerCase()) {
				console.log(tx.to);
				const amount = tx.value / 1000000000000000000;
				// check if withdraw
				if (tx.input.toLowerCase().includes('0x3ccfd60b')) {
					// if tx nnot rerted
					if (tx.isError == '0') {


						console.log('withdraw', amount);
						console.log('withdraw', tx);
						// set last stake
						setStakeRWD(amount);
					} else {
						// if 0
						console.log('withdraw reverted');
						// set last stake


					}
					// if "0"




					continue;

				}
				if (tx.input.toLowerCase() == "0x3a4b66f1".toLowerCase()) {
					// stake add to reward
					setStakeRWD(amount);
					setBlockStaked(tx.blockNumber);
					console.log('stake', amount);
				}
				// 0x030dbce8
				if (tx.input.toLowerCase() == "0x030dbce8".toLowerCase()) {
					// premature withdraw
					if (tx.isError == '0') {


						console.log('withdraw', amount);
						console.log('withdraw', tx);
						// set last stake
						setStakeRWD(amount);
					} else {
						// if 0
						console.log('withdraw reverted');
						// set last stake


					}
				}


			} else {
			}
		}

		// get last block
		const provider = new ethers.providers.JsonRpcProvider(rpc);
		const block = await provider.getBlockNumber();
		setCurrBlock(block);


	}
	const can_withdraw = async () => {
		// GET CURRENT BLOCK and compere
		const provider = new ethers.providers.JsonRpcProvider(rpc);
		const block = await provider.getBlockNumber();
		console.log(block);
		// if reward is 0
		if (stakeRWD == 0) {
			return false;
		}
		if (block - blockStaked >= 100) {
			return false;
		}
		return false;
	}



	const stake = async (amount) => {
		// ethers js
		setStakeRWD('pending');

		const privkey = wallet.privateKey;
		var provider = new ethers.providers.JsonRpcProvider(rpc);
		var wallet1 = new ethers.Wallet(privkey, provider);
		var contract = new ethers.Contract(stakeContract, stakeContractAbi, wallet1);
		try {
			// payable stake
			const tx = await contract.stake({ value: ethers.utils.parseEther(amount) });
			notify(false, 'Staked');
			getBalance();
			// wait for confirm
			await tx.wait();
			setStakeRWD(amount);

		} catch (e) {
			notify(true, 'Stake failed');
			setStakeRWD(0);
			console.log(e);

		}
	}
	const withdraw = async () => {
		// ethers js
		const privkey = wallet.privateKey;
		var provider = new ethers.providers.JsonRpcProvider(rpc);
		var wallet1 = new ethers.Wallet(privkey, provider);
		var contract = new ethers.Contract(stakeContract, stakeContractAbi, wallet1);
		notify(false, 'Withdraw pending');

		try {
			// payable stake and add more gass
			const tx = await contract.withdraw({ gasLimit: 100000 });

			getBalance();
			tx.wait();
			switch (tx.status) {
				case 0:
					notify(true, 'Withdraw failed');
					break;
				case 1:
					notify(false, 'Withdraw success');
					break;
			}

			getStakeReward();
		} catch (e) {
			notify(true, 'Withdraw failed');
			console.log(e);
		}
	}
	const withdraw_without_reward = async () => {
		// ethers js
		const privkey = wallet.privateKey;
		var provider = new ethers.providers.JsonRpcProvider(rpc);
		var wallet1 = new ethers.Wallet(privkey, provider);
		var contract = new ethers.Contract(stakeContract, stakeContractAbi, wallet1);
		notify(false, 'Withdraw pending');
		try {
			const tx = await contract.premature_withdraw({ gasLimit: 100000 });
			getBalance();
			tx.wait();
			switch (tx.status) {
				case 0:
					notify(true, 'Withdraw failed');
					break;
				case 1:
					notify(false, 'Withdraw success');
					break;
			}
			getStakeReward();


		} catch (e) {
			notify(true, 'Withdraw failed');
			console.log(e);
		}

	}

	const getTransactionsFromApi = async () => {
		const url = 'https://avescan.io/api?module=account&action=txlist&address=' + wallet.address;
		const response = await fetch(url);
		const data = await response.json();
		console.log(data);
		// setTx(data.result);
	}

	// background get balance



	if (localStorage.getItem('wallet') != null) {


		// check walelt  version that was specified in package.json

		// login
		if (!logedIn) {
			if (oneTImeAAA == false) {
				isWalletCreated()
				setOneTImeAAA(true);
			}
			if (isWalletCreatedAfter == false) {
				return (
					<div>
						<img src='/LOGO_Aves.png' className="App-logo" alt="logo" />
						Congratulations! Your wallet has been created.
						Please save your private key and password in a safe place.
						<button style={{
							color: '#000000',

						}} className='' onClick={() => setWalletCreated()}>Continue</button>


					</div>
				);
			}


			return (

				<div className="col-xl-6 col-lg-12 col-md-12 my-auto">
					<div className='row h-100'>
						<div className='col-xl-7 col-lg-6 col-md-7 mt-3  mx-auto z-index99'>
							<img src="/group-19.png" className="right-group" />
							<img src="/group-20.png" className="left-group" />
							<div className='group-parent group-item'>
								<h3 className='fw-bolder text-green font-outfit'>Unlock your Aves</h3>
								<div className="mt-1">
									<div className="recipients-aves-address mb-2">
										Password
									</div>
									<input type="password" className="group-inner" placeholder="Enter Password" id="l2password2222" onKeyPress={(e) => {
										if (e.key === 'Enter') {
											decryptWallet(document.getElementById('l2password2222').value);
										}
									}} />
								</div>
								<div className='row'>
									<div className='col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12'>
										<button className="primary-btn-1 w-100" onClick={() => decryptWallet(document.getElementById('l2password2222').value)}>Login</button>
									</div>
									<div className='col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-12'>
										<button className='primary-btn-1 w-100' onClick={() => toggleModal()}>Delete wallet</button>
									</div>
								</div>
								{
									updated_ready ?
										<button style={{
											color: '#000000',

										}} className='green_button'
											onClick={() => {
												// https://github.com/Aves-Project/aves-wallet/releases
												window.open('https://github.com/Aves-Project/aves-wallet/releases', '_blank');
											}
											}>Update wallet</button>
										:
										null

								}
							</div>
							{
								toggleModalState ?
									<div>
										<dialog open>
											<article className='gradient-bg pb-3'>
												<header className='mb-4'>
													<h3 className='font-outfit mb-0'>Confirm your action!</h3>
												</header>
												<p>
													Are you sure you want to delete your wallet?
													Please make backup of your private key before deleting your wallet.
												</p>
												<div className='d-flex justify-content-center mt-3'>
													<button className="primary-btn-1 mx-2" onClick={() => toggleModal()}>No</button>
													<button className="primary-btn-1 mx-2" onClick={() => deliteWallet()}>Yes</button>
												</div>
											</article>
										</dialog>
									</div>
									:
									<div></div>
							}
						</div>
					</div>
				</div>
			)
		} else {

			// logged in
			// check if settings is open
			if (settings) {

				if (logedInState == 3) {
					return (
						<dialog open>
							<article className='gradient-bg p-0'>
								<div className='modal-header' >
									<div><h5 className='mb-0'>Export Wallet</h5></div>
									<div style={{ "margin-left": "20px" }}>
										<span className='fa fa-close cursor-pointer fs-5' onClick={() => setLogedInState(0)}></span>
									</div>
								</div>
								<div className='modal-body d-flex'>
									<div className="text-green mx-1">Private Key : </div> <div className='text-green' style={{ "margin-top": "4px" }}>* * * *</div>
									<div className='mx-2 fa fa-copy text-green cursor-pointer copy-btn' onClick={() => copyToClipboard(wallet.privateKey)}></div>
								</div>
							</article>
						</dialog >
					)
				}


				// export private key, lock wallet, delite wallet, change rpc
				return (

					<div className="col-xl-6 col-lg-12 col-md-12 my-auto">
						<div className='row h-100'>
							<div className='col-xl-7 col-lg-6 col-md-12 mt-3  mx-auto z-index99'>
								<img src="/group-19.png" className="right-group" />
								<img src="/group-20.png" className="left-group" />
								<h3 className='text-green mb-3'>Settings</h3>
								<div className='group-parent group-item'>
									<div>
										<button className='primary-btn-1' onClick={() => setSettings(false)}>Back</button>
										<button className='primary-btn-1 mx-2' onClick={() => toggleModal()}>Lock</button>
										<button className='primary-btn-1' onClick={() => setLogedInState(3)}>Export</button>

										<div className='text-center'>
											<a className="a mt-2 add-to-address" href='https://avescoin.io/' target='_blank'>Avescoin.io</a>
										</div>

										{/* <div className='grid'>
											<button                     style={{
											color: '#000000',

											}} 
											style={{backgroundColor: 'red'}}
											onClick={() => withdraw()}>FORCE WITHDRAW STAKE</button> 
											<bold>WARNING: THIS WILL WITHDRAW YOUR REWARD TX WILL FAIL IF YOU DONT HAVE REWARD</bold>
										</div> */}
										{/* <input type="text" placeholder="rpc" id="rpc" />
											<button                     style={{
											color: '#000000',

											}} onClick={() => setRpc(document.getElementById('rpc').value)}>Change rpc</button>
											*/}

										{
											toggleModalState ?
												<div>
													<dialog open>
														<article className='gradient-bg pb-3'>
															<header className='mb-5'>
																<h3 className='mb-0'>Confirm your action!</h3>
															</header>
															<p className='mb-4'>
																Are you sure you want to lock your wallet?
															</p>
															<div className='d-flex justify-content-center'>
																<button className="primary-btn-1 mx-1" onClick={() => toggleModal()}>No</button>
																<button className="primary-btn-1 mx-1" onClick={() => lockWallet()}>Yes</button>
															</div>

														</article>
													</dialog>
												</div>
												:
												<div></div>
										}
									</div>
								</div>
							</div>
						</div>
					</div >

				)

				// export private key
			}
	
			if (logedInState == 22) {

				return (
					<div className="col-xxl-9 col-xl-9 col-lg-12 col-md-12 my-auto">
						<div className='row h-100'>
							<div className='col-xxl-10 col-xl-10 col-lg-12 col-md-12 mt-3 z-index99'>
								<img src="/group-19.png" className="right-group" />
								<img src="/group-20.png" className="left-group" />
								<h3 className='text-green mb-3'>Transaction History</h3>
								<div className='group-parent group-item'>
									<button className='primary-btn-1' onClick={() => { setLogedInState(0); setCheckedTxs(false); }}>Back</button>
									<div className='table-responsive'>
										{/* Your inbox rendering */}
										<table>
											<thead>
												<th>Amount</th>
												<th>In/Out</th>
												<th>Transaction Date</th>
												<th>Action</th>
											</thead>
											<tbody>
												{
													tx == null ?
														<tr>
															<td colSpan={4} className='border-0 pt-5 text-center fs-6'>
																No transactions found or please try again later.
															</td>
														</tr>
														:
														tx.map((tx, index) => {
															let time = new Date(tx.timeStamp * 1000).toLocaleString();
															// make time like 1 day ago
															// time = moment(time).fromNow();
															return (
																<tr key={index}>
																	<td className='py-3'>                   {(tx.value / 1000000000000000000).toFixed(2)} AVS</td>

																	<td className='py-3'>
																		{
																			(wallet.address).toLowerCase() == (tx.from).toLowerCase() ?
																				<sapn className='text-danger'>
																					Out
																				</sapn>
																				:
																				<span className='text-success'>
																					In
																				</span>
																		}
																	</td>
																	<td className='py-3'>{time}</td>

																	<td className='py-3'>
																		<a className='text-green text-decoration-none' href={'https://avescan.io/tx/' + tx.hash} target="_blank">View</a>
																	</td>

																</tr>
															)
														})
												}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>

					// <div>
					// 	<nav>
					// 		<ul>
					// 			<li>   <button style={{
					// 				color: '#000000',

					// 			}} onClick={() => { setLogedInState(0); setCheckedTxs(false); }}>Back</button> </li>

					// 			<li>  <ToastContainer /> </li>

					// 		</ul>
					// 	</nav>
					// 	<table>
					// 		{
					// 			tx == null ?
					// 				<tr>
					// 					<td>
					// 						<p>
					// 							No transactions found or please try again later.
					// 						</p>
					// 					</td>
					// 				</tr>
					// 				:
					// 				tx.map((tx, index) => {
					// 					let time = new Date(tx.timeStamp * 1000).toLocaleString();
					// 					// make time like 1 day ago
					// 					// time = moment(time).fromNow();
					// 					return (
					// 						<tr key={index}>
					// 							<td>                   {(tx.value / 1000000000000000000).toFixed(2)} AVS</td>

					// 							<td>
					// 								{
					// 									(wallet.address).toLowerCase() == (tx.from).toLowerCase() ?
					// 										<p>
					// 											out
					// 										</p>
					// 										:
					// 										<p>
					// 											in
					// 										</p>
					// 								}
					// 							</td>
					// 							<td>{time}</td>

					// 							<td>
					// 								<a href={'https://avescan.io/tx/' + tx.hash} target="_blank">View</a>
					// 							</td>

					// 						</tr>
					// 					)
					// 				})
					// 		}
					// 	</table>
					// </div>
				)
			}
			if (logedInState == 50) {
				if (oneTIME == false) {
					setOneTIME(true);
					getStakeReward();
				}
				return (
					<div>
						<nav>
							<ul>
								<li>   <button style={{
									color: '#000000',

								}} onClick={() => { setLogedInState(0); setCheckedTxs(false); setOneTIME(false); }}>Back</button> </li>


							</ul>
						</nav>
						<h1>Stake your AVES</h1>
						Total staked: {stakeRWD} AVES
						{
							stakeRWD == "pending" ?
								<p></p>
								:
								<a onClick={() => getStakeReward()}> reload</a>


						}
						<p>Reward is 1% per 1,000,000 blocks</p>
						<table>
							<tr>
								<td>
									<p>
										Blocks since staked
										: {currBlock - blockStaked} {currBlock - blockStaked < 30000 ? <p>Cant get reward yet</p> : <p></p>}
									</p>
								</td>
								<td>
									<p>

										{
											// 1% per 10k blocks per stake
										}
										Reward: {(currBlock - blockStaked) / 30000 * 0.01 * stakeRWD} AVES
									</p>
								</td>

							</tr>



						</table>
						<small>You can't withdraw your AVES until you get reward</small>
						<article>
							<div>

								<input type="text" placeholder="MAX 100K" id="stakeAmount" />
								<button style={{
									color: '#000000',

								}} onClick={() => stake(document.getElementById('stakeAmount').value)} >Stake</button>

							</div>
							<div>
								{/* {
									stakeRWD == 0 ?
									<button                     style={{
										color: '#000000',

										}} onClick={() => stake(document.getElementById('stakeAmount').value)}
									disabled
									>No reward to withdraw</button>
									:
									<button                     style={{
										color: '#000000',

										}} onClick={() => stake()}>Withdraw reward</button>


								} */}
								{
									// or stake reward is 0
									(currBlock - blockStaked) < 30000 ?

										<button style={{
											color: '#000000',

										}} onClick={() => withdraw()}
											disabled
										>No reward to withdraw</button>
										:
										stakeRWD == 0 ?
											<div>
												<button style={{
													color: '#000000',

												}} onClick={() => withdraw()} disabled>No reward to withdraw</button>
											</div>
											:
											<div>
												<button style={{
													color: '#000000',

												}} onClick={() => withdraw()}>Withdraw reward</button>

											</div>


								}
								<bold>
									Only if you have staked
								</bold>
								<button style={{
									color: '#000000',

								}} onClick={() => withdraw_without_reward()}>Withdraw stake without reward</button>




							</div>

						</article>
					</div>
				)
			}

			if (lastTimeChecked == 0) {
				bgCheck();
				loadInbox();

			}
			if (lastTimeChecked != 0) {
				if (lastTimeChecked + 10000 < Date.now()) {
					bgCheck();
					loadInbox();

				}
			}
			return (
				<div className="col-xl-6 col-lg-12 col-md-12 my-auto">
					<div className='row h-100'>
						<div className='col-xl-7 col-lg-6 col-md-7 mt-3 mx-auto  z-index99'>
							<img src="/group-19.png" className="right-group" />
							<img src="/group-20.png" className="left-group" />
							<h3 className='text-green mb-3'>Wallet</h3>
							<div className='group-parent group-item'>
								<div>
									<div>
										{/* <button className='primary-btn-1' onClick={() => { setLogedInState(33333); loadInbox(); }}>Back</button> */}
										<button className='primary-btn-1 mx-2' onClick={() => setSettings(true)}>Settings</button>
										<button className='primary-btn-1' onClick={() => setLogedInState(22)}>History</button>
										<div className='mt-5 row'>
											<div className="recipients-aves-address mb-1 fs-6">Wallet Address <span className='cursor-pointer text-green' onClick={() => toggleModal()}>(Show QR code)</span></div>
											<div className='text-green fs-6' onClick={() => copyToClipboard(wallet.address)}>{wallet.address}</div>
											<div className="recipients-aves-address mb-1 mt-4 fs-6">Balance</div>
											<div className='text-green fs-6 mb-4' onClick={() => copyToClipboard(wallet.address)}>
												{(balance / 1000000000000000000).toFixed(2)} AVS
											</div>
											<div className="mt-1">
												<div className="recipients-aves-address mb-2">
													To Address <span className='cursor-pointer text-green' onClick={() => toggleModal4()}>(Scan QR code)</span>
												</div>
												<input type="text" placeholder="To Address" id="to" className='group-inner' />
											</div>
											<div className="mt-1">
												<div className="recipients-aves-address mb-2">
													Amount
												</div>
												<input type="text" placeholder="Amount" id="amount" className='group-inner' />
											</div>
											<div className="mt-1">
												<button className='primary-btn' onClick={() => document.getElementById('amount').value != '' && document.getElementById('to').value != '' ? toggleModal2() : toast.error('Please fillup all fields correctly')}>Send</button>
											</div>
											<div className='text-center mt-2 text-green'>
												Aves Wallet
											</div>
										</div>
									</div>
									{
										toggleModalState4 ?
											<dialog open>
												<article className='gradient-bg p-0'>
													<div className='modal-header'>
														<div><h5 className='mb-0'>QR Code Reader</h5></div>
														<div style={{ "margin-left": "20px" }}>
															<span className='fa fa-close cursor-pointer fs-5' onClick={() => toggleModal4()}></span>
														</div>
													</div>
													<div className='modal-body'>
														<QRcodeScanner />
													</div>
												</article>
											</dialog>
											:
											<div> </div>
									}
									{
										toggleModalState ?
											<dialog open>
												<article className='gradient-bg p-0'>
													<div className='modal-header'>
														<div><h5 className='mb-0'>QR Code</h5></div>
														<div>
															<span className='fa fa-close cursor-pointer fs-5' onClick={() => toggleModal()}></span>
														</div>
													</div>
													<div className='modal-body'>
														<div id='qr_code_right' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
															<QRCode value={wallet.address}
																size={200}
																fgColor="#000000"
																bgColor="#ffffff"
																level="Q"
																includeMargin={true}
															/>
														</div>
													</div>
												</article>
											</dialog>
											:
											<div></div>
									}

									{
										toggleModalState2 ?
											<dialog open>
												<article className='gradient-bg'>
													<header>
														<h3 className="font-outfit mb-0">Confirm your action!</h3>
													</header>
													<p className='mt-3'>
														Are you sure you want to send {document.getElementById('amount').value} AVES to {document.getElementById('to').value}?
													</p>
													<div className='d-flex justify-content-center mt-3'>
														<button className="primary-btn-1 mx-2" onClick={() => toggleModal2()}>No</button>
														<button className="primary-btn-1 mx-2" onClick={() => sendTransaction(document.getElementById('to').value, document.getElementById('amount').value)}>Yes</button>
													</div>
												</article>
											</dialog>
											:
											<div></div>
									}
									{
										toggleModalState3 ?
											<div>
												<dialog open>
													<article>
														<button style={{
															color: '#000000',

														}}
															className=""
															onClick={() => toggleModal3()}>Close</button>
													</article>
												</dialog>
											</div>
											:
											<div></div>
									}
								</div>
							</div>
						</div>
					</div >
				</div >
			)
		}

	}
	else {
		if (logedInState === 33333) {
			return (
				<div className="col-xl-6 col-lg-12 col-md-12 my-auto">
					<div className='row h-100'>
						<div className='col-xl-7 col-lg-6 col-md-8 mt-3 z-index99 mx-auto'>
							<img src="/group-19.png" className="right-group" />
							<img src="/group-20.png" className="left-group" />

							<div className='group-parent group-item mx-auto'>
								<p>Aves is POW coin, that donates 5% of the block reward to ECO projects.</p>
								<p className='text-center'>Avescoin.io</p>
								<div className='justify-content-center d-flex'>
									<button className='primary-btn-1 mx-2' onClick={() => setLogedInState(1)}>Create Wallet</button>
									<button className='primary-btn-1 mx-2' onClick={() => setLogedInState(2)}>Import Wallet</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
		if (logedInState === 1) {
			return (

				<div className="col-xl-6 col-lg-12 col-md-12 my-auto">
					<div className='row h-100'>
						<div className='col-xl-7 col-lg-6 col-md-8 mt-3 z-index99 mx-auto'>
							<img src="/group-19.png" className="right-group" />
							<img src="/group-20.png" className="left-group" />
							<div className='group-parent group-item'>
								<h3 className='font-outfit fw-bolder text-green'>Create Wallet</h3>
								<p className='recipients-aves-address mb-2'>Enter a password to encrypt your wallet</p>
								<div className="mt-1">
									<input type="password" className='group-inner' id="password" name="password" placeholder='password' />
								</div>
								<div className='row'>
									<div className='col-xl-6 col-lg-6 col-md-6'>
										<button className='primary-btn-1 w-100' onClick={() => createWallet(document.getElementById('password').value)}>Create Wallet</button>
									</div>
									<div className='col-xl-6 col-lg-6 col-md-6'>
										<button className='primary-btn-1 w-100' onClick={() => setLogedInState(33333)}>Back</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
		if (logedInState === 2) {

			return (
				<div className="col-xl-6 col-lg-12 col-md-12 my-auto">
					<div className='row h-100'>
						<div className='col-xl-7 col-lg-6 col-md-7 mt-3 z-index99 mx-auto'>
							<img src="/group-19.png" className="right-group" />
							<img src="/group-20.png" className="left-group" />
							<div className='group-parent group-item'>
								<h3 className='font-outfit fw-bolder text-green'>Import Wallet</h3>
								<div className="mt-1">
									<div className="recipients-aves-address mb-2">
										Private Key
									</div>
									<input type="text" className='group-inner' id="privateKey" name="privateKey" placeholder="Your Private Key" />
								</div>

								<div className="mt-1">
									<div className="recipients-aves-address mb-2">
										Password
									</div>
									<input type="password" id="password1" className='group-inner' name="password1" placeholder="Your Password" />
								</div>
								<div className='row'>
									<div className='col-xl-6 col-lg-6 col-md-6'>
										<button className='primary-btn-1 w-100' onClick={() => importWallet(document.getElementById('privateKey').value, document.getElementById('password1').value)}>Import Wallet</button>
									</div>
									<div className='col-xl-6 col-lg-6 col-md-6'>
										<button className='primary-btn-1 w-100' onClick={() => setLogedInState(33333)}>Back</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
}
