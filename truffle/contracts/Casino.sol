contract Casino {
   address public owner;
   uint256 public minimumBet;
   uint256 public totalBet;
   uint256 public numberOfBets;
   uint256 public maxAmountOfBets = 100;
   address[] public players;
   struct Player {
      uint256 amountBet;
      uint256 numberSelected;
   }
   // The address of the player and => the user info
   mapping(address => Player) public playerInfo;

   function Casino(uint256 _minimumBet) {
   owner = msg.sender;
   if(_minimumBet != 0 ) minimumBet = _minimumBet;
   }

   function kill() public {
      if(msg.sender == owner) selfdestruct(owner);
   }
}
