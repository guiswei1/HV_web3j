import React, { Component } from 'react';
import Web3 from "web3";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalAmount:0,
      withrawable:0,
      unReleased:0,
      totalReleased:0
    };
  }

  //链接钱包
  async DidMount () {
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
        const address = "0xF22277851468603d581caFF1aa3F279dba8ADB2E"
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
    // 请求待释放数据


  }

//待释放
GetterPendingItem = () => {
//   //查询用户未释放的token数量
//   var unReleased = 0;
//   var totalReleased = 0;
//   var totalAmount = 0;
//   window.myContract.methods.unReleased(window.defaultAccount).call({from:window.defaultAccount}).then(value=>{
//     console.log(value)
//     unReleased = value * Math.pow(10,-18);
//     this.setState({unReleased:unReleased})
//   })
// //查询用户存进去的token目前释放了多少
//   window.myContract.methods.totalReleased(window.defaultAccount).call({from:window.defaultAccount}).then(value=>{
//     console.log(value)
//     totalReleased = value * Math.pow(10,-18);
//     this.setState({totalReleased:totalReleased})
//   })
//   totalAmount = unReleased+totalReleased;
// this.setState({totalAmount:totalAmount})

//用户可以取出来的token数量
window.myContract.methods.withrawable(window.defaultAccount).call({from:window.defaultAccount}).then(value=>{
  console.log(value)
  this.setState({withrawable:value * Math.pow(10,-18)})
})
}

 //领取
Harvest =() =>{ 
  window.myContract.methods.harvest().send({from:window.defaultAccount})
  .on('transactionHash',(transactionHash)=>{
    console.log('transactionHash',transactionHash)
  })
  .on('confirmation',(confirmationNumber,receipt)=>{
    console.log({ confirmationNumber: confirmationNumber, receipt: receipt })
    //刷新待释放数据
    if(confirmationNumber ==21){
      window.myContract.methods.withrawable(window.defaultAccount).call({from:window.defaultAccount}).then(value=>{
        console.log(value)
        this.setState({withrawable:value * Math.pow(10,-18)})
      })
    }
  })
  //----------------------------------------------------------------------
}
render() {
  
  return (
    <div>
      <div><button onClick={() => { this.DidMount() }}>链接钱包</button></div>
      <div><span>-----------------------------------------------------------</span></div>
        <div>
          {/*<label >用户未释放数量:</label><span> {this.state.unReleased}</span><br/>
          <label >用户已经放数量:</label><span> {this.state.totalReleased}</span> <br/> */}
            <label >待释放:</label><span>{this.state.withrawable}</span><br/>
         </div>
      <div> <button onClick={() => { this.GetterPendingItem() }}>查询待释放</button></div>
      <div>
        <button onClick={() => { this.Harvest() }}>领取</button>
      </div>
      <div></div>
    </div>
  );
}
}export default App;