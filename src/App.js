import React, { Component } from 'react';
import Web3 from "web3";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPledge:0,
      pending:0
    };
  }
async componentDidMount() {
  //判断页面是否安装Metamask
  if (typeof window.ethereum !== 'undefined') {
    const ethereum = window.ethereum
    //禁止自动刷新，metamask要求写的
    ethereum.autoRefreshOnNetworkChange = false

    try {
      //第一次链接Metamask
      const accounts = await ethereum.enable()
      console.log(accounts)
      //初始化Provider
      const provider = window['ethereum']
      console.log(provider)
      //获取网络ID
      console.log(provider.chainId)
      //实例化Web3
      const web3 = new Web3(provider)
      console.log(web3)
      //导入abi文件
      const abi = require("./contract.abi.json")
      //定义合约地址
      const address = "0xb2eDFE0069A54E5937F7e01bD916f74Ae1C73e1C"
      //实例化合约
      window.myContract = new web3.eth.Contract(abi.abi,address)
      console.log(window.myContract)
      window.defaultAccount = accounts[0].toLowerCase()
      console.log(window.defaultAccount)

      ethereum.on('accountsChanged', function (accounts) {
        console.log("accountsChanged:" + accounts)
      })
      ethereum.on('networkChanged', function (networkVersion) {
        console.log("networkChanged:" + networkVersion)
      })
    } catch (e) {

    }
  } else {
    console.log('没有metamask')
  }
}
//查询质押信息
GetterPendingItem = () => {
  window.myContract.methods.getPendingItem().call({from:window.defaultAccount}).then(value=>{
    console.log(value)
    console.log(value.pending)
    console.log(value.totalPledge)
    this.setState({totalPledge:value.totalPledge * Math.pow(10,-18),pending:value.pending * Math.pow(10,-18)})
  })
}

 //今日待领取
Pending =() =>{  
  
  const sendAmount = Web3.utils.toBN(this.state.pending  * 10 ** 18);
  console.log(sendAmount);
  window.myContract.methods.userPending(sendAmount).send({from:window.defaultAccount})
  .on('transactionHash',(transactionHash)=>{
    console.log('transactionHash',transactionHash)
  })
  .on('confirmation',(confirmationNumber,receipt)=>{
    console.log({ confirmationNumber: confirmationNumber, receipt: receipt })
  })
  .on('receipt',(receipt)=>{
    console.log({ receipt: receipt })
  })
  .on('error',(error,receipt)=>{
    console.log({ error: error, receipt: receipt })
  })
}
render() {

  return (
    <div>
        <div>
          <label >质押数额:</label><span id="totalPledge" > {this.state.totalPledge}</span> 
            <label >:今日待领取数额:</label><span id="pending" >{this.state.pending}</span>
         </div>
      <div></div>
      <div>
        <button onClick={() => { this.GetterPendingItem() }}>查质押信息</button>
      </div>
      <div>
        <button onClick={() => { this.Pending() }}>今日待领取</button>
      </div>
      <div></div>
    </div>
  );
}
}export default App;