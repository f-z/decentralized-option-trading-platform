pragma solidity ^0.4.24;

import "./ownable.sol";
import "./registry.sol"; // importing so the contract knows the ABI to interact with

contract OptionFactory is Ownable {

    uint markupPercentage;
  
    function setMarkupPercentage(uint _percentage) external onlyContractOwner {
        markupPercentage = _percentage;
    }

    /**
     * Constructor setting the markup percentage
     */
    constructor (uint _percentage) public {
        markupPercentage = _percentage;
    }

    modifier onlyBuyerOfOption(uint _id) {
        require(msg.sender == optionToBuyer[_id], "Only the option buyer can execute this function!");
        _;
    }

    struct Option {
        string asset;
        uint exercisePrice;
        uint expirationDate;
        bool exercised;
    }

    Option[] public options;

    mapping (uint => address) optionToBuyer;
    mapping (address => uint) buyerOptionCount;
    mapping (address => uint) buyerBalance;

    event OptionPremium(address indexed buyer, uint premium);

    /**
     * @dev Calculating intrinsic value, but not time value
     * because of no support for floating arithmetic
     * and probability distributions in Solidity
     * (yet)
     */
    function calculateOptionPremium(uint _exercisePrice) public payable returns(uint, uint) {
        Registry registry = Registry(registryAddress);
        uint spotPrice = stringToUint(registry.averagePrice()) / 100;
        uint intrinsicValue = _exercisePrice - spotPrice;
        uint premium = intrinsicValue + ((intrinsicValue * markupPercentage) / 100);
        emit OptionPremium(msg.sender, premium);
        return (premium, spotPrice);
    }
  
    event NewOption(address indexed _buyer, uint indexed _id, uint _balanceLeft);

    function buyOption(string _asset, uint _exercisePrice, uint _expirationDate) external payable {
        // calculating and retrieving the option premium
        (uint premium, uint ethToUSD) = calculateOptionPremium(_exercisePrice);
        // converting the premium from USD to eth and then wei
        // checking to see that the user sent enough to buy the option
        require(msg.value >= ((premium * 1000000000000000000) / ethToUSD), "Not enough ether sent to buy the option!");
        uint id = options.push(Option(_asset, _exercisePrice, _expirationDate, false)) - 1;
        optionToBuyer[id] = msg.sender;
        buyerOptionCount[msg.sender] = buyerOptionCount[msg.sender].add(1);
        emit NewOption(msg.sender, id, buyerBalance[msg.sender]);
    }

    function buyOptionWithBalance(string _asset, uint _exercisePrice, uint _expirationDate) external {
        (uint premium, uint ethToUSD) = calculateOptionPremium(_exercisePrice);
        require(buyerBalance[msg.sender] >= ((premium * 1000000000000000000) / ethToUSD), "Not enough balance!");
        buyerBalance[msg.sender] -= (premium * 1000000000000000000) / ethToUSD;
        uint id = options.push(Option(_asset, _exercisePrice, _expirationDate, false)) - 1;
        optionToBuyer[id] = msg.sender;
        buyerOptionCount[msg.sender] = buyerOptionCount[msg.sender].add(1);
        emit NewOption(msg.sender, id, buyerBalance[msg.sender]);
    }

    event OptionExercise(address indexed _buyer, uint _settlementAmount, uint _balanceLeft);

    function exerciseOption(uint _id) public onlyBuyerOfOption(_id) returns(bool) {
        if (now >= options[_id].expirationDate) {
            if (!options[_id].exercised) {
                options[_id].exercised = true;
                Registry registry = Registry(registryAddress);
                uint spotPrice = stringToUint(registry.averagePrice()) / 100;
                uint settlementAmount = options[_id].exercisePrice - spotPrice;
                // converting settlement amount from USD back to wei to add to buyer balance
                buyerBalance[msg.sender] += (settlementAmount * 1000000000000000000) / spotPrice;
                emit OptionExercise(msg.sender, settlementAmount, buyerBalance[msg.sender]);
            }
            return true;
        } else {
            return false;
        }
    }

    function getOptionCount() external view returns(uint) {
        uint result = buyerOptionCount[msg.sender];
        return result;
    }

    function getOptionsByBuyer() external view returns(uint[]) {
        uint[] memory result = new uint[](buyerOptionCount[msg.sender]);
        uint counter = 0;
        for (uint i = 0; i < options.length; i++) {
            if (optionToBuyer[i] == msg.sender) {
                result[counter] = i;
                counter++;
            }
        }

        return result;
    }

    // one fixed master registry
    address registryAddress = parseAddr("0xd7303fafe84917a550834ea01e43db473a5e71c9");

    /**
     * @dev Only allowing the master administrator to change the registry's address,
     * for security purposes.
     */
    function setRegistryAddress(address _newAddress) external payable onlyMasterOwner {
        registryAddress = _newAddress;
    }

    uint minimumDepositAmount = 0.01 ether;

    modifier aboveMinimumDepositAmount() {
        require(msg.value >= minimumDepositAmount, "The amount sent is below the minimum threshold!");
        _;
    }

    function setMinimumDepositAmount(uint _amount) external onlyContractOwner {
        minimumDepositAmount = _amount;
    }

    function deposit() external payable aboveMinimumDepositAmount {
        buyerBalance[msg.sender] += msg.value;
    }

    event Withdrawal(address indexed buyer, uint amount, uint balanceLeft);

    function withdraw(uint _amount) external {
        require(buyerBalance[msg.sender] >= _amount, "Not enough balance!");
        buyerBalance[msg.sender] -= _amount;
        msg.sender.transfer(_amount);
        emit Withdrawal(msg.sender, _amount, buyerBalance[msg.sender]);
    }

    function getBalance() external view returns(uint) {
        return buyerBalance[msg.sender];
    }

    event Drained(uint balance);

    function drain() external onlyContractOwner returns (bool) {
        emit Drained(address(this).balance);
        msg.sender.transfer(address(this).balance);
        return true;
    }

    function kill() public onlyContractOwner {
        selfdestruct(msg.sender);
    }
}
