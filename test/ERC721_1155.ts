// Import necessary dependencies
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC1155", function () {
  let owner: { address: any; };
  let recipient: { address: any; };
  let operator: { address: any; };
  let erc1155: { deployed: () => any; mint: (arg0: any, arg1: number, arg2: number) => any; setApprovalForAll: (arg0: any, arg1: boolean) => any; connect: (arg0: any) => {
      safeBatchTransferFrom(address: any, address1: any, tokenIds: number[], amounts: number[], arg4: string): any; (): any; new(): any; safeTransferFrom: { (arg0: any, arg1: any, arg2: number, arg3: number, arg4: string): any; new(): any; }; 
}; balanceOf: (arg0: any, arg1: number) => any; };

  before(async function () {
    // Deploy the ERC1155 contract
    [owner, recipient, operator] = await ethers.getSigners();
    const ERC1155Contract = await ethers.getContractFactory("ERC1155");
    erc1155 = await ERC1155Contract.deploy();
    // await erc1155.deployed();
  });

  describe('Safe Transfer From',function(){
        it('should revert unapproved transaction',async function(){
            const tokenId = 1;
            const amount = 100;
            await expect( erc1155.connect(operator).safeTransferFrom(owner.address, recipient.address, tokenId, amount, "0x")).to.be.revertedWith("not approved")
        }),

        it('should revert send money to default address',async function(){
            const tokenId = 1;
            const amount = 100;
            const defaultAddress = "0x0000000000000000000000000000000000000000";
            await erc1155.setApprovalForAll(operator.address, true);
            await expect( erc1155.connect(operator).safeTransferFrom(owner.address, defaultAddress, tokenId, amount, "0x")).to.be.revertedWith("to = 0 address")
        })

        it("should transfer tokens correctly", async function () {
        const tokenId = 1;
        const amount = 100;

        // Mint tokens to the owner
        await erc1155.mint(owner.address, tokenId, amount);

        // Approve the operator to transfer tokens on behalf of the owner
        await erc1155.setApprovalForAll(operator.address, true);

        // Transfer tokens from owner to recipient using the operator
        await erc1155.connect(operator).safeTransferFrom(owner.address, recipient.address, tokenId, amount, "0x");

        // Check the balances after the transfer
        const ownerBalance = await erc1155.balanceOf(owner.address, tokenId);
        const recipientBalance = await erc1155.balanceOf(recipient.address, tokenId);

        expect(ownerBalance.toNumber()).to.equal(0); // Owner's balance should be reduced to 0
        expect(recipientBalance.toNumber()).to.equal(amount); // Recipient should receive the tokens
    });
    
  });

  describe('Safe Batch Transfer From',function(){

    it('should revert unapproved transaction',async function(){
        const tokenIds = [1,2,3];
        const amounts = [100,2,4];
        await expect( erc1155.connect(operator).safeBatchTransferFrom(owner.address, recipient.address, tokenIds, amounts, "0x")).to.be.revertedWith("not approved")
    }),

    it('should revert send money to default address',async function(){
        const tokenIds = [1,2,3];
        const amounts = [100,2,4];
        const defaultAddress = "0x0000000000000000000000000000000000000000";
        await erc1155.setApprovalForAll(operator.address, true);
        await expect( erc1155.connect(operator).safeBatchTransferFrom(owner.address, defaultAddress, tokenIds, amounts, "0x")).to.be.revertedWith("to = 0 address")
    }),


    it('should revert unequal length',async function(){
        const tokenIds = [1,2,3];
        const amounts = [100,2];
        await erc1155.setApprovalForAll(operator.address, true);
        await expect( erc1155.connect(operator).safeBatchTransferFrom(owner.address, recipient.address, tokenIds, amounts, "0x")).to.be.revertedWith("ids length != values length")
    })



    it("should transfer tokens correctly", async function () {
        const tokenIds = [1,2,3];
        const amounts = [100,2,4];
        // Mint tokens to the owner
        // await erc1155.mint(owner.address, tokenId, amount);

        // Approve the operator to transfer tokens on behalf of the owner
        await erc1155.setApprovalForAll(operator.address, true);

        // Transfer tokens from owner to recipient using the operator
        await erc1155.connect(operator).safeBatchTransferFrom(owner.address, recipient.address, tokenIds, amounts, "0x");

        // // Check the balances after the transfer
        // const ownerBalance = await erc1155.balanceOf(owner.address, tokenIds);
        // const recipientBalance = await erc1155.balanceOf(recipient.address, tokenIds);

        // expect(ownerBalance.toNumber()).to.equal(0); // Owner's balance should be reduced to 0
        // expect(recipientBalance.toNumber()).to.equal(amounts); // Recipient should receive the tokens
    });

  });

  // Add more test cases for other functions and edge cases as needed
});
