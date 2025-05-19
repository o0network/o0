// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {Ownable} from "@solady/contracts/auth/Ownable.sol";
import {ERC20} from "@solady/contracts/tokens/ERC20.sol";
import {SafeTransferLib} from "@solady/contracts/utils/SafeTransferLib.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

contract TokenABC is ERC20, Ownable {
    using SafeTransferLib for address;

    // ABC parameters
    uint256 public alpha; // Base price coefficient
    uint256 public r; // Reserve ratio in basis points (e.g., 5000 = 50%)

    // RL model parameters (updated externally)
    uint256 public lastUpdateTimestamp;
    uint256 public updateFrequency; // Minimum time between parameter updates

    // Quadratic Funding metrics
    mapping(address => uint256) public contributions;
    uint256 public totalContributions;
    uint256 public quadraticValuation;

    // Dynamic locking mechanism
    mapping(address => uint256) public purchasePrices;
    mapping(address => uint256) public lockedTokens;

    // Staking for PoS
    mapping(address => uint256) public stakes;
    mapping(address => bool) public predictions;
    uint256 public totalStaked;

    // Project metrics
    bool public projectSuccessful;
    uint256 public projectDeadline;

    // Constants
    uint256 private constant PRECISION = 1e18;
    uint256 private constant BASIS_POINTS = 10000;

    // Events
    event TokensPurchased(address indexed buyer, uint256 amountIn, uint256 amountOut);
    event TokensSold(address indexed seller, uint256 amountIn, uint256 amountOut);
    event ParametersUpdated(uint256 newAlpha, uint256 newR);
    event ContributionAdded(address indexed contributor, uint256 amount);
    event StakeAdded(address indexed staker, uint256 amount, bool prediction);
    event StakeResolved(address indexed staker, uint256 newStake, bool wasCorrect);
    event TokensUnlocked(address indexed holder, uint256 amount);

    constructor(
        uint256 _alpha,
        uint256 _r,
        uint256 _updateFrequency,
        uint256 _projectDeadline,
        address _owner
    ) {
        // ABC parameters initialization
        alpha = _alpha;
        r = _r; // Should be between 0-10000 (0-100%)

        // RL model parameters
        updateFrequency = _updateFrequency;
        lastUpdateTimestamp = block.timestamp;

        // Project settings
        projectDeadline = _projectDeadline;
        projectSuccessful = false;

        _initializeOwner(_owner);
    }

    // ABC formula calculation: P(s) = alpha * s^beta, where beta = 1/(1-r)
    function calculatePrice(uint256 supply) public view returns (uint256) {
        if (supply == 0) return alpha;

        // Convert r from basis points to a fraction
        uint256 rFraction = r * PRECISION / BASIS_POINTS;

        // Calculate beta = 1/(1-r)
        uint256 denominator = PRECISION - rFraction;
        if (denominator == 0) return type(uint256).max; // Avoid division by zero

        uint256 beta = PRECISION * PRECISION / denominator;

        // Calculate s^beta using approximation for non-integer exponents
        // In a production system, this would use a library for precise power function
        uint256 priceEstimate = alpha;
        for (uint256 i = 0; i < beta / PRECISION; i++) {
            priceEstimate = priceEstimate * supply / PRECISION;
        }

        return priceEstimate;
    }

    // Buy tokens using ETH based on bonding curve
    function buyTokens() external payable {
        require(msg.value > 0, "Must send ETH");

        uint256 currentSupply = totalSupply();
        uint256 currentPrice = calculatePrice(currentSupply);

        // Simple approximation for token amount based on current price
        // In production, this would use integral of the bonding curve
        uint256 tokensToMint = msg.value * PRECISION / currentPrice;

        _mint(msg.sender, tokensToMint);

        // Record purchase price for dynamic locking
        purchasePrices[msg.sender] = currentPrice;
        lockedTokens[msg.sender] += tokensToMint;

        emit TokensPurchased(msg.sender, msg.value, tokensToMint);
    }

    // Sell tokens and receive ETH based on bonding curve
    function sellTokens(uint256 amount) external {
        require(amount > 0, "Amount must be positive");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(lockedTokens[msg.sender] == 0, "Tokens are locked");

        uint256 currentSupply = totalSupply();
        uint256 currentPrice = calculatePrice(currentSupply - amount);

        uint256 ethToReturn = amount * currentPrice / PRECISION;

        _burn(msg.sender, amount);

        (bool success,) = msg.sender.call{value: ethToReturn}("");
        require(success, "ETH transfer failed");

        emit TokensSold(msg.sender, amount, ethToReturn);
    }

    // Add contribution for Quadratic Funding valuation
    function contribute() external payable {
        require(msg.value > 0, "Must send ETH");
        require(block.timestamp < projectDeadline, "Project deadline passed");

        contributions[msg.sender] += msg.value;
        totalContributions += msg.value;

        // Update quadratic valuation: QF = (sum(ci))^2
        uint256 sumSqrt = 0;
        // In production, this would be calculated off-chain or use a more gas-efficient approach
        for (uint256 i = 0; i < 10; i++) { // Just for demo, in real code would iterate through all contributors
            address contributor = address(uint160(i + 1)); // Demo address generation
            sumSqrt += sqrt(contributions[contributor]);
        }
        quadraticValuation = sumSqrt * sumSqrt;

        emit ContributionAdded(msg.sender, msg.value);
    }

    // Add stake with prediction (PoS mechanism)
    function stake(uint256 amount, bool prediction) external {
        require(amount > 0, "Stake amount must be positive");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, address(this), amount);

        stakes[msg.sender] += amount;
        predictions[msg.sender] = prediction;
        totalStaked += amount;

        emit StakeAdded(msg.sender, amount, prediction);
    }

    // Resolve stakes after project outcome is determined
    function resolveStakes() external onlyOwner {
        require(block.timestamp >= projectDeadline, "Project not ended yet");

        // In reality, the project success would be determined by external oracle or governance
        // For demo, let's assume projectSuccessful is set by owner

        for (uint256 i = 0; i < 10; i++) { // Just for demo, in real code would iterate through all stakers
            address staker = address(uint160(i + 1)); // Demo address generation
            if (stakes[staker] > 0) {
                bool wasCorrect = predictions[staker] == projectSuccessful;

                if (wasCorrect) {
                    // Reward for correct prediction (e.g., +10%)
                    uint256 reward = stakes[staker] * 10 / 100;
                    stakes[staker] += reward;
                    _mint(address(this), reward); // Mint additional tokens as reward
                } else {
                    // Penalty for incorrect prediction (e.g., -5%)
                    uint256 penalty = stakes[staker] * 5 / 100;
                    stakes[staker] -= penalty;
                    _burn(address(this), penalty);
                }

                emit StakeResolved(staker, stakes[staker], wasCorrect);
            }
        }
    }

    // Withdraw staked tokens
    function withdrawStake() external {
        require(block.timestamp >= projectDeadline, "Project not ended yet");
        require(stakes[msg.sender] > 0, "No stake to withdraw");

        uint256 amount = stakes[msg.sender];
        stakes[msg.sender] = 0;
        totalStaked -= amount;

        _transfer(address(this), msg.sender, amount);
    }

    // Check if tokens can be unlocked (price >= purchase price)
    function checkUnlock() external {
        require(lockedTokens[msg.sender] > 0, "No locked tokens");

        uint256 currentPrice = calculatePrice(totalSupply());
        if (currentPrice >= purchasePrices[msg.sender]) {
            uint256 amount = lockedTokens[msg.sender];
            lockedTokens[msg.sender] = 0;

            emit TokensUnlocked(msg.sender, amount);
        }
    }

    // RL-based parameter update (called by authorized external oracle/agent)
    function updateParameters(uint256 newAlpha, uint256 newR) external onlyOwner {
        require(block.timestamp >= lastUpdateTimestamp + updateFrequency, "Update too frequent");
        require(newR <= BASIS_POINTS, "Reserve ratio too high");

        alpha = newAlpha;
        r = newR;
        lastUpdateTimestamp = block.timestamp;

        emit ParametersUpdated(newAlpha, newR);
    }

    // Helper function to calculate square root
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;

        uint256 z = (x + 1) / 2;
        uint256 y = x;

        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }

        return y;
    }

    // Token metadata
    function name() public pure override returns (string memory) {
        return "ABC-RL Token";
    }

    function symbol() public pure override returns (string memory) {
        return "ABCRL";
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }

    // Recovery functions
    function rescueToken(address token, address recipient) external onlyOwner {
        token.safeTransfer(recipient, IERC20(token).balanceOf(address(this)));
    }

    function rescueETH(address payable recipient) external onlyOwner {
        (bool success,) = recipient.call{value: address(this).balance}("");
        require(success, "ETH transfer failed");
    }

    receive() external payable {
        buyTokens();
    }
}