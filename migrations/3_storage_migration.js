const StorageContract = artifacts.require("Storage");

module.exports = async function (deployer) {
  await deployer.deploy(StorageContract);
};
