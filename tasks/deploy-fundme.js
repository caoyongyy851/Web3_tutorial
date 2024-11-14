const { task } = require("hardhat/config")

task("deploy-fundme", "deploy fundme contract").setAction(async (taskArgs, hre) => {
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
})

async function verifyFundMe(fundMeAddr, args) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
    });
}

module.exports = {}