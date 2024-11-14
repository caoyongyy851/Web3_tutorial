const { task } = require("hardhat/config")

task("interact-fundme", "interact with fundme contract")
    .addParam("addr", "fundme contract address")
    .setAction(async (taskArgs, hre) => {
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        const fundMe = fundMeFactory.attach(taskArgs.addr)
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
    })

module.exports = {}