pragma solidity ^0.4.24;

import "./ownable.sol";
import "./oracle.sol";

contract PriceOracle is usingOracle, Ownable {

    string public provider;
    string public urlPart1;
    string public symbol;
    string public urlPart2;
    string public price;

    event ConstructorInitiated(string nextStep);
    event NewOracleQuery(string description);
    event PriceUpdated(bytes32 id, string price);

    constructor (string _provider, string _urlPart1, string _symbol, string _urlPart2) public payable {
        emit ConstructorInitiated(
            strConcat(_provider, " oracle constructor was initiated. Call 'updatePrice()' to send the query to the oracle."));
        provider = _provider;
        urlPart1 = _urlPart1;
        symbol = _symbol;
        urlPart2 = _urlPart2;
    }

    function updatePrice() public payable {
        if (oraclize_getPrice("URL") > address(this).balance) {
            emit NewOracleQuery(strConcat(provider, " oracle query was NOT sent, please add some ETH for the query fee!"));
        } else {
            emit NewOracleQuery(strConcat(provider, " oracle query was sent, waiting for the response..."));
            oraclize_query("URL", strConcat("json(", urlPart1, symbol, urlPart2));
        }
    }

    function __callback(bytes32 id, string result) public {
        if (msg.sender != oraclize_cbAddress()) revert("Callback from unauthorised address!");
        price = result;
        emit PriceUpdated(id, result);
    }

    function updateSymbol(string _symbol) public payable onlyContractOwner {
        symbol = _symbol;
    }
}
