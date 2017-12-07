import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';

class App extends Component {

  constructor() {
    super();
    this.state = {
      contractABI: null,
      kittie: null,
      value: 'Inset Kittie Id',
    }
  }

  componentDidMount() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/NzP7ERSK2gBdaihWWzix"))
      // Use Mist/MetaMask's provider
      console.log("yay");
      fetch("https://api.etherscan.io/api?module=contract&action=getabi&address=0x06012c8cf97bead5deae237070f9587f8e7a266d")
      .then(response => response.json())
      .then(json => {
        this.setState(() => {
          return {contractABI: JSON.parse(json.result)}
        });
      });
    } else {
      alert("FUCK YOU INSTALL METAMASK!");
    }
  }

  getKittie() {
    console.log(this.state.contractABI);
    let contract = new window.web3.eth.Contract(this.state.contractABI, '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d');
    let result = contract.methods.getKitty(this.state.value).call().then(result => {
      console.log(result);
      this.setState({ kittie: result });
    });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    let kittie;

    if (this.state.kittie !== null) {
      kittie = (
        <div>
          <h2>
            { this.state.value }
          </h2>
          <img height="125px" src={ 'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/' + this.state.value + '.svg' } />
          <p>
            <span className="App-label">Genome: </span> <span>{ this.state.kittie.genes }</span>
          </p>
        </div>
      );
    } else {
      kittie = (
        <p>No kittie info :( </p>
      );
    }

    return (
      <div className="App">
        <div>
          <input 
            type="text"
            id="kittie-id"
            placeholder="Your Kittie Id" 
            value={ this.state.value }
            onChange={ e => this.handleChange(e) } />
          <button id="get-kittie-button" onClick={ e => this.getKittie(e) }>Get Kittie!</button>
        </div>

        <div>
          { kittie }
        </div>
      </div>
    );
  }

}

export default App;
