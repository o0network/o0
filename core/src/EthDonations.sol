// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {Ownable} from "@solady/contracts/auth/Ownable.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {SafeTransferLib} from "@solady/contracts/utils/SafeTransferLib.sol";

contract EthDonations is Ownable {
    using SafeTransferLib for address;

    error DonationsEnded();
    error DonationsNotEnded();
    error NoDonationOrTokens();
    error TransferFailed();
    error DonationsGoalReached();
    error DonationsGoalNotReached();
    error DonationsAlreadyClaimed();
    error DonationsNotClaimable();
    error DonationsAlreadyQueued();
    error DonationsNotQueued();
    error LengthMismatch();
    error AmountMismatch();
    error ZeroAmount();
    error InsufficientBalance();
    error TokensLocked();
    error UpdateTooFrequent();
    error ReserveRatioTooHigh();
    error InvalidSupplyForPrice();

    event Donation(address indexed donor, uint256 ethAmount, uint256 tokensIssued);
    event DonationReturned(address indexed donor, uint256 tokensBurned, uint256 ethAmount);
    event TokensUnlocked(address indexed holder, uint256 amount);
    event ParametersUpdated(uint256 newAlpha, uint256 newR);

    uint256 public immutable donationsGoal;
    uint256 public immutable donationsEndTime;

    mapping(address => uint256) public donationTokens;
    uint256 public totalTokensIssued;
    uint256 public donationsTotalEth;
    uint256 public claimTimestamp;

    uint256 public alpha;
    uint256 public r;
    uint256 public lastUpdateTimestamp;
    uint256 public updateFrequency;

    mapping(address => uint256) public purchasePrices;
    mapping(address => uint256) public lockedTokens;

    uint256 private constant PRECISION = 1e18;
    uint256 private constant BASIS_POINTS = 10000;

    constructor(
        uint256 _donationsGoal,
        uint256 _donationsEndTime,
        uint256 _initialAlpha,
        uint256 _initialR,
        uint256 _updateFrequency,
        address _owner
    ) {
        if (_initialR == 0 || _initialR > BASIS_POINTS) revert ReserveRatioTooHigh();
        donationsGoal = _donationsGoal;
        donationsEndTime = _donationsEndTime;
        alpha = _initialAlpha;
        r = _initialR;
        updateFrequency = _updateFrequency;
        lastUpdateTimestamp = block.timestamp;
        _initializeOwner(_owner);
    }

    // --- ABC Bonding Curve ---
    // P(s) = alpha * s^beta, beta = 1/(1-r)
    function _beta() internal view returns (uint256) {
        uint256 rFraction = r * PRECISION / BASIS_POINTS;
        return (PRECISION * PRECISION) / (PRECISION - rFraction); // scaled by 1e18
    }

    // s^b, where b is scaled by 1e18
    function _pow(uint256 base, uint256 exp) internal pure returns (uint256) {
        if (exp == PRECISION) return base;
        if (exp == 0) return PRECISION;
        // Use exp(log(base) * exp/PRECISION)
        // log and exp are not native in Solidity, so use a simple approximation for small exponents
        uint256 result = PRECISION;
        uint256 n = exp / PRECISION;
        for (uint256 i = 0; i < n; i++) {
            result = result * base / PRECISION;
        }
        return result;
    }

    function calculatePrice(uint256 supply) public view returns (uint256) {
        if (supply == 0) return alpha;
        uint256 beta = _beta();
        return alpha * _pow(supply, beta) / PRECISION;
    }

    // Integral for buy: returns tokens for ETH (continuous, not linear)
    function getTokensForEth(uint256 ethAmount) public view returns (uint256) {
        if (ethAmount == 0) return 0;
        uint256 beta = _beta();
        uint256 supply = totalTokensIssued;
        // F(s) = alpha/(beta+1) * s^(beta+1)
        uint256 k = alpha * PRECISION / (beta + PRECISION); // scaled
        uint256 s1 = _pow(supply, beta + PRECISION);
        // Solve for s2: F(s2) - F(s1) = ethAmount
        // s2 = ((ethAmount * 1e18 / k) + s1)
        uint256 s2 = s1 + ethAmount * PRECISION * PRECISION / k;
        uint256 tokens = s2 > s1 ? (s2 - s1) / (beta + PRECISION) : 0;
        return tokens;
    }

    // Integral for sell: returns ETH for tokens
    function getEthForTokens(uint256 tokensToSell) public view returns (uint256) {
        if (tokensToSell == 0 || tokensToSell > totalTokensIssued) return 0;
        uint256 beta = _beta();
        uint256 supply = totalTokensIssued;
        uint256 k = alpha * PRECISION / (beta + PRECISION);
        uint256 s1 = _pow(supply, beta + PRECISION);
        uint256 s2 = _pow(supply - tokensToSell, beta + PRECISION);
        return (s1 - s2) * k / (PRECISION * PRECISION);
    }

    // --- Donation and Token Logic ---
    function donate() public payable {
        if (block.timestamp >= donationsEndTime) revert DonationsEnded();
        if (claimTimestamp > 0) revert DonationsAlreadyClaimed();
        if (msg.value == 0) revert ZeroAmount();
        uint256 tokensToIssue = getTokensForEth(msg.value);
        if (tokensToIssue == 0) revert NoDonationOrTokens();
        donationTokens[msg.sender] += tokensToIssue;
        totalTokensIssued += tokensToIssue;
        donationsTotalEth += msg.value;
        uint256 avgPrice = purchasePrices[msg.sender];
        uint256 locked = lockedTokens[msg.sender];
        uint256 newPrice = msg.value * PRECISION / tokensToIssue;
        purchasePrices[msg.sender] = (avgPrice * locked + newPrice * tokensToIssue) / (locked + tokensToIssue);
        lockedTokens[msg.sender] += tokensToIssue;
        emit Donation(msg.sender, msg.value, tokensToIssue);
    }

    function returnDonation(uint256 tokensToReturn) external {
        if (tokensToReturn == 0) revert ZeroAmount();
        if (donationTokens[msg.sender] < tokensToReturn) revert InsufficientBalance();
        bool allowFullReturn = block.timestamp >= donationsEndTime && donationsTotalEth < donationsGoal;
        if (!allowFullReturn && lockedTokens[msg.sender] >= tokensToReturn) {
            uint256 price = calculatePrice(totalTokensIssued);
            if (price < purchasePrices[msg.sender]) revert TokensLocked();
        }
        uint256 ethAmount = getEthForTokens(tokensToReturn);
        if (ethAmount == 0) revert TransferFailed();
        if (address(this).balance < ethAmount) revert InsufficientBalance();
        donationTokens[msg.sender] -= tokensToReturn;
        totalTokensIssued -= tokensToReturn;
        donationsTotalEth -= ethAmount;
        if (lockedTokens[msg.sender] >= tokensToReturn) lockedTokens[msg.sender] -= tokensToReturn;
        else lockedTokens[msg.sender] = 0;
        (bool success,) = msg.sender.call{value: ethAmount}("");
        if (!success) revert TransferFailed();
        emit DonationReturned(msg.sender, tokensToReturn, ethAmount);
    }

    function checkAndUnlockTokens() external {
        uint256 locked = lockedTokens[msg.sender];
        if (locked == 0) return;
        uint256 price = calculatePrice(totalTokensIssued);
        if (price >= purchasePrices[msg.sender]) {
            lockedTokens[msg.sender] = 0;
            emit TokensUnlocked(msg.sender, locked);
        }
    }

    // --- Admin and Claiming Logic ---
    function queueClaim() external onlyOwner {
        if (claimTimestamp > 0) revert DonationsAlreadyQueued();
        if (donationsTotalEth < donationsGoal) revert DonationsGoalNotReached();
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
    function updateABCParameters(uint256 newAlpha, uint256 newR) external onlyOwner {
        if (block.timestamp < lastUpdateTimestamp + updateFrequency) revert UpdateTooFrequent();
        if (newR == 0 || newR > BASIS_POINTS) revert ReserveRatioTooHigh();
        alpha = newAlpha;
        r = newR;
        lastUpdateTimestamp = block.timestamp;
        emit ParametersUpdated(newAlpha, newR);
    }
    function addDonationsFor(address[] calldata donors, uint256[] calldata amountsEth) external payable onlyOwner {
        if (block.timestamp >= donationsEndTime) revert DonationsEnded();
        if (claimTimestamp > 0) revert DonationsAlreadyClaimed();
        if (donors.length != amountsEth.length) revert LengthMismatch();
        uint256 totalEthValue = 0;
        for(uint256 i = 0; i < amountsEth.length; i++) totalEthValue += amountsEth[i];
        if (msg.value != totalEthValue) revert AmountMismatch();
        for (uint256 i = 0; i < donors.length; i++) {
            if (amountsEth[i] == 0) continue;
            uint256 tokensToIssue = getTokensForEth(amountsEth[i]);
            if (tokensToIssue == 0) continue;
            donationTokens[donors[i]] += tokensToIssue;
            totalTokensIssued += tokensToIssue;
            uint256 newPrice = amountsEth[i] * PRECISION / tokensToIssue;
            uint256 locked = lockedTokens[donors[i]];
            purchasePrices[donors[i]] = (purchasePrices[donors[i]] * locked + newPrice * tokensToIssue) / (locked + tokensToIssue);
            lockedTokens[donors[i]] += tokensToIssue;
            emit Donation(donors[i], amountsEth[i], tokensToIssue);
        }
        donationsTotalEth += totalEthValue;
    }
    function rescueToken(address tokenAddress, address recipient) external onlyOwner {
        IERC20(tokenAddress).safeTransfer(recipient, IERC20(tokenAddress).balanceOf(address(this)));
    }
    function getDonationTokens(address user) external view returns (uint256) {
        return donationTokens[user];
    }
    function getLockedTokens(address user) external view returns (uint256) {
        return lockedTokens[user];
    }
    receive() external payable { donate(); }
}
