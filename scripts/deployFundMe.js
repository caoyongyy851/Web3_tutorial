//1.导入ethers.js包
//2.创建main函数
//3.执行main函数
const { ethers } = require("hardhat")

async function main() {
    //创建合约工厂
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log(`contract deploying`)
    //部署合约
    const fundMe = await fundMeFactory.deploy(100)
    //等待合约打包区块完成
    await fundMe.waitForDeployment()
    console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`)
    //在区块链网络上验证合约
    if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_APIKEY) {
        console.log("Waiting for 5 confirmations")
        await fundMe.deploymentTransaction().wait(5)
        verifyFundMe(fundMe.target, [100])
    } else {
        console.log("verification skipped ...")
    }

    //初始化两个账户
    const [firstAccount, secondAccount] = await ethers.getSigners()
    //account1调用fund
    const fundTx = await fundMe.fund({ value: ethers.parseEther("0.005") })
    await fundTx.wait()
    //获取合约上的余额
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance : ${balanceOfContract}`)
    //account2调用fund
    const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({ value: ethers.parseEther("0.005") })
    await fundTxWithSecondAccount.wait()
    //获取合约上的余额
    const balanceOfContractAfterSencondFund = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance : ${balanceOfContractAfterSencondFund}`)
    //check mapping
    const firstAccountBalanceInFundnme = await fundMe.funderToAmount(firstAccount.address)
    const secondAccountBalanceInFundnme = await fundMe.funderToAmount(secondAccount.address)
    console.log(`Balance of first: ${firstAccountBalanceInFundnme}`)
    console.log(`Balance of second: ${secondAccountBalanceInFundnme}`)



}

async function verifyFundMe(fundMeAddr, args) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });
}

main().then().catch((error) => {
    console.error(error)
    process.exit(1)
})