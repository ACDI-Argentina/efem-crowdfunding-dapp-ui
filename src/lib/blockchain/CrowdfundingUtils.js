const params = {
  "NewDonation" : ['uint256', 'uint256', 'address', 'uint256'],
};
const signatures = {
  "NewDonation": "NewDonation(uint256,uint256,address,uint256)",
}

class CrowdfundingUtils {
  constructor(web3,crowdfundingAddress) {
    this.web3 = web3;
    this.crowdfundingAddress = crowdfundingAddress;
  }

  isEventOfType(topic,type){
    return topic === this.web3.utils.keccak256(signatures[type]);
  }

  getEventData(receipt, eventType) {
    const log = (receipt.logs.filter(l => l.address === this.crowdfundingAddress))[0];
    if (this.isEventOfType(log.topics[0],eventType)) {
      const eventData = this.web3.eth.abi.decodeParameters(params[`${eventType}`], log.data);
      const [donationId, entityId, tokenAddress, amount] = Object.values(eventData);
      return {
        donationId,
        entityId,
        tokenAddress,
        amount
      }
    }
  }

}

export default CrowdfundingUtils;