const namehash = require('eth-ens-namehash').hash;	// <---
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/8227a733c47346d0a7c66c3f9242eecc')); // Replace with actual Infura project ID

const ensAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
const domainName = 'dislub.eth';
const domainNameHash = namehash(domainName);		// <---

const oldOwnerPrivateKey = '';
const newOwnerAddress = '0x40518701079135B46781054B0f0dF3B2b3c526BA'; // Replace with actual new owner address

const ens = new web3.eth.Contract(require('./ens-abi.json'), ensAddress);

const oldOwnerAddress = web3.eth.accounts.privateKeyToAccount(oldOwnerPrivateKey).address;
console.log('Domain: '+domainName);
console.log('Old Owner: '+oldOwnerAddress);
console.log('New Owner: '+newOwnerAddress);

web3.eth.getTransactionCount(oldOwnerAddress, (err, txCount) => {
	// Build the transaction
	const tx = {
		nonce: web3.utils.toHex(txCount),
		from: oldOwnerAddress,
		to: ens.options.address,
		value: 0,
		gas: 200000,
		data: ens.methods.setOwner(domainNameHash, newOwnerAddress).encodeABI(),	// <---
	}

	console.log(tx);

	const signPromise = web3.eth.accounts.signTransaction(tx, oldOwnerPrivateKey);
	signPromise.then((signedTx) => {
		web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, txHash) => {
			if (err) {
				console.error(err);
			}else{
				console.log('txHash:', txHash);
			}
		});
	}).catch((err) => {
		console.error(err);
	});
})