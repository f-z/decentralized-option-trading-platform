// Adapted from:
// https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol
pragma solidity ^0.4.24;

import "./safemath.sol";

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address
 * and provides basic authorization control functions.
 * This simplifies the implementation of "user permissions".
 */
contract Ownable {
    // using the safe math library to prevent over/underflows
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() public {
        owner = msg.sender;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyContractOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function!");
        _;
    }

    /**
     * @dev Throws if called by any account other than the master (registry) owner.
     */
    modifier onlyMasterOwner() {
        require(msg.sender == parseAddr("0xC18AD6E102905fb84B0447077497956c407E6e79"), "Only the registry owner can call this function!");
        _;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyContractOwner {
        require(newOwner != address(0), "The new owner must be different to the previous one!");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function stringToUint(string s) public pure returns (uint) {
        bytes memory b = bytes(s);
        uint result = 0;

        for (uint i = 0; i < b.length; i++) { // c = b[i] was not needed
            if (b[i] >= 48 && b[i] <= 57) {
                result = result * 10 + (uint(b[i]) - 48); // bytes and int are not compatible with the operator -.
            }
        }

        return result;
    }

    function uintToString(uint value) public pure returns (string) {
        uint v = value; // reassigning for security purposes
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;

        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(48 + remainder);
        }

        bytes memory s = new bytes(i); // i + 1 is inefficient

        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - j - 1]; // to avoid the off-by-one error
        }

        string memory str = string(s);  // memory isn't implicitly convertible to storage

        return str;
    }

    /**
     * From oraclize library
     */
    function parseAddr(string _a) internal pure returns (address) {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;

        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(tmp[i]);
            b2 = uint160(tmp[i + 1]);
            if ((b1 >= 97) && (b1 <= 102)) b1 -= 87;
            else if ((b1 >= 65) && (b1 <= 70)) b1 -= 55;
            else if ((b1 >= 48) && (b1 <= 57)) b1 -= 48;
            if ((b2 >= 97) && (b2 <= 102)) b2 -= 87;
            else if ((b2 >= 65) && (b2 <= 70)) b2 -= 55;
            else if ((b2 >= 48) && (b2 <= 57)) b2 -= 48;
            iaddr += (b1 * 16 + b2);
        }

        return address(iaddr);
    }

    /** Babylonian method of calculating square root
     * from https://ethereum.stackexchange.com/questions/2910/can-i-square-root-in-solidity
     */
    function sqrt(uint x) public pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;

        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
