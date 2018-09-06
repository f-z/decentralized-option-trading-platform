pragma solidity ^0.4.24;

import "./ownable.sol";
import "./price_oracle.sol";

/**
 * @title Registry
 * @dev The registry for sellers (master contract)
 */
contract Registry is Ownable, usingOracle {

    struct Seller {
        string name;
        address account;
        address factory;
    }

    mapping (address => Seller) public sellers;
	// lookup table as pattern for key storage to enable total discoverability of data
	// inspired by:
	// https://ethereum.stackexchange.com/questions/15337/can-we-get-all-elements-stored-in-a-mapping-in-the-contract
    address[] public addressLUT;

    /**
	 * Public getter function that returns size of LUT containing addresses
	 */
    function size() public view returns (uint) {
        return addressLUT.length;
    }

    event Registered(string name, address indexed account);

	/**
	 * Registration function
	 */
    function register(string _name) external payable returns (bool success) {
		// require that the name does not already exist
        require(!isRegistered(msg.sender), "This account is already registered!");
        addressLUT.push(msg.sender);
        sellers[msg.sender] = Seller(_name, msg.sender, 0);
        emit Registered(_name, msg.sender);
        return true;
    }

    function isRegistered(address _account) public view returns (bool) {
        return sellers[_account].account != 0;
    }

    function setFactoryAddress(address _factoryAddress) public {
        sellers[msg.sender].factory = _factoryAddress;
    }

    string public price;
    string public averagePrice;

    event OraclePrice(string price);
    event AverageOraclePrice(string price);

    /** 
	 * Getting price from a given oracle at a specified address
	 */
    function getPrice(address _oracleAddress) public payable returns (string) {
        PriceOracle oracleContract = PriceOracle(_oracleAddress);
        price = oracleContract.price();
        emit OraclePrice(price);
        return price;
    }
	
	/**
	 * Getting prices from all three oracle addresses
	 * Solidity does not support fixed point numbers yet,
	 * hence the extra calculations
	 */
    function getAveragePrice(
        address _oracleAddress1, address _oracleAddress2,
        address _oracleAddress3) public payable returns (string) {

        PriceOracle oracleContract1 = PriceOracle(_oracleAddress1);
        PriceOracle oracleContract2 = PriceOracle(_oracleAddress2);
        PriceOracle oracleContract3 = PriceOracle(_oracleAddress3);
        uint price1 = stringToUint(oracleContract1.price());
        uint price1_decimal = (price1 % 100000000) / 1000000;
        price1 /= 100000000;
        uint price2 = stringToUint(oracleContract2.price());
        uint price2_decimal = (price2 % 1000000000 ) / 10000000;
        price2 /= 1000000000;
        uint price3 = stringToUint(oracleContract3.price());
        uint price3_decimal = price3 % 100;
        price3 /= 100;
        averagePrice = strConcat(
            uintToString((price1 * 4 + price2 * 3 + price3 * 3) / 10),
            ".",
            uintToString((price1_decimal * 4 + price2_decimal * 3 + price3_decimal * 3) / 10));
        emit AverageOraclePrice(averagePrice);
        return averagePrice;
    }
}
