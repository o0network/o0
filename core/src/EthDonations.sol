// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {Ownable} from "@solady/contracts/auth/Ownable.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {SafeTransferLib} from "@solady/contracts/utils/SafeTransferLib.sol";

contract EthDonations is Ownable {
    using SafeTransferLib for address;

    error DonationsEnded();
    error DonationsNotEnded();
    error NoDonation();
    error TransferFailed();
    error DonationsGoalReached();
    error DonationsGoalNotReached();
    error DonationsAlreadyClaimed();
    error DonationsNotClaimable();
    error DonationsAlreadyQueued();
    error DonationsNotQueued();
    error LengthMismatch();
    error AmountMismatch();

    event Donation(address indexed donor, uint256 amount);

    uint256 public immutable donationsGoal;
    uint256 public immutable donationsEndTime;

    mapping(address => uint256) public donations;
    uint256 public donationsTotal;
    uint256 public claimTimestamp;

    constructor(uint256 _donationsGoal, uint256 _donationsEndTime, address _owner) {
        donationsGoal = _donationsGoal;
        donationsEndTime = _donationsEndTime;
        _initializeOwner(_owner);
    }

    function donate() public payable {
        if (block.timestamp >= donationsEndTime) revert DonationsEnded();
        if (claimTimestamp > 0) revert DonationsAlreadyClaimed();
        if (msg.value == 0) revert NoDonation();
        donations[msg.sender] += msg.value;
        donationsTotal += msg.value;

        emit Donation(msg.sender, msg.value);
    }

    function returnDonation() external {
        if (block.timestamp < donationsEndTime) revert DonationsNotEnded();
        if (donationsTotal >= donationsGoal) revert DonationsGoalReached();
        if (claimTimestamp > 0) revert DonationsAlreadyClaimed();

        uint256 amount = donations[msg.sender];
        if (amount == 0) revert NoDonation();
        donations[msg.sender] = 0;

        (bool success,) = msg.sender.call{value: amount}("");
        if (!success) revert TransferFailed();
    }

    function queueClaim() external onlyOwner {
        if (claimTimestamp > 0) revert DonationsAlreadyQueued();
        if (donationsTotal < donationsGoal) revert DonationsGoalNotReached();

        claimTimestamp = block.timestamp;
    }

    function claim(address recipient) external onlyOwner {
        if (claimTimestamp == 0) revert DonationsNotQueued();
        if (block.timestamp < claimTimestamp + 60) revert DonationsNotClaimable();
        uint256 amount = address(this).balance;
        if (amount == 0) revert DonationsAlreadyClaimed();

        (bool success,) = recipient.call{value: amount}("");
        if (!success) revert TransferFailed();
    }

    function addDonationsFor(address[] calldata donors, uint256[] calldata amounts) external payable onlyOwner {
        if (msg.value == 0) revert NoDonation();
        if (block.timestamp >= donationsEndTime) revert DonationsEnded();
        if (claimTimestamp > 0) revert DonationsAlreadyClaimed();

        uint256 length = donors.length;
        if (donors.length != amounts.length) revert LengthMismatch();

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < length; i++) {
            totalAmount += amounts[i];
            donations[donors[i]] += amounts[i];
            emit Donation(donors[i], amounts[i]);
        }

        if (totalAmount != msg.value) revert AmountMismatch();
        donationsTotal += totalAmount;
    }

    function rescueToken(address token, address recipient) external onlyOwner {
        token.safeTransfer(recipient, IERC20(token).balanceOf(address(this)));
    }

    receive() external payable {
        donate();
    }

    fallback() external payable {
        donate();
    }
}
