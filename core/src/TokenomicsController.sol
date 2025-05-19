// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import {Ownable} from "@solady/contracts/auth/Ownable.sol";
import {SafeTransferLib} from "@solady/contracts/utils/SafeTransferLib.sol";
import {TokenABC} from "./TokenABC.sol";

/**
 * @title TokenomicsController
 * @dev Controls tokenomics parameters via RL model's outputs
 * The actual RL training happens off-chain with a Deep Q-Network
 * This contract serves as the interface for applying RL decisions on-chain
 */
contract TokenomicsController is Ownable {
    using SafeTransferLib for address;

    // Linked token contract
    TokenABC public token;

    // State variables used by the RL model
    struct MarketState {
        uint256 timestamp;
        uint256 price;        // Current token price
        uint256 supply;       // Current token supply
        uint256 volume24h;    // 24h trading volume
        uint256 buys24h;      // Number of buy transactions in 24h
        uint256 sells24h;     // Number of sell transactions in 24h
        uint256 tvl;          // Total value locked
        uint256 qfValuation;  // Quadratic funding valuation
    }

    // Historical market states
    MarketState[] public marketStates;
    uint256 public updateInterval; // Minimum time between state updates
    uint256 public lastStateUpdate;

    // RL model action boundaries
    uint256 public minAlpha;
    uint256 public maxAlpha;
    uint256 public minR;
    uint256 public maxR;

    // System metrics
    uint256 public cumulativeStability;    // Measure of price stability
    uint256 public projectSuccessRate;     // Rate of successful projects
    uint256 public investorReturnRate;     // Rate of positive investor returns

    // Mode flags
    bool public rlEnabled;  // Whether RL-based parameter adjustment is enabled

    // Events
    event StateUpdated(uint256 indexed stateIndex, uint256 price, uint256 supply);
    event ActionApplied(uint256 newAlpha, uint256 newR, bool isRlBased);
    event ModeChanged(bool rlEnabled);
    event MetricsUpdated(uint256 stability, uint256 projectSuccess, uint256 investorReturn);

    constructor(
        address _token,
        uint256 _updateInterval,
        uint256 _minAlpha,
        uint256 _maxAlpha,
        uint256 _minR,
        uint256 _maxR,
        address _owner
    ) {
        token = TokenABC(_token);
        updateInterval = _updateInterval;
        lastStateUpdate = block.timestamp;

        // Set RL action boundaries
        minAlpha = _minAlpha;
        maxAlpha = _maxAlpha;
        minR = _minR;
        maxR = _maxR;

        // Initialize metrics
        cumulativeStability = 0;
        projectSuccessRate = 0;
        investorReturnRate = 0;

        // Start with RL disabled
        rlEnabled = false;

        _initializeOwner(_owner);
    }

    /**
     * @dev Updates the current market state
     * @param price Current token price from DEX
     * @param volume24h 24h trading volume
     * @param buys24h Number of buy transactions in 24h
     * @param sells24h Number of sell transactions in 24h
     * @param tvl Total value locked
     */
    function updateMarketState(
        uint256 price,
        uint256 volume24h,
        uint256 buys24h,
        uint256 sells24h,
        uint256 tvl
    ) external onlyOwner {
        require(block.timestamp >= lastStateUpdate + updateInterval, "Update too frequent");

        // Create new market state
        MarketState memory newState = MarketState({
            timestamp: block.timestamp,
            price: price,
            supply: token.totalSupply(),
            volume24h: volume24h,
            buys24h: buys24h,
            sells24h: sells24h,
            tvl: tvl,
            qfValuation: token.quadraticValuation()
        });

        // Add to history
        marketStates.push(newState);
        lastStateUpdate = block.timestamp;

        // Calculate and update stability metric if we have enough history
        if (marketStates.length >= 2) {
            uint256 lastIdx = marketStates.length - 1;
            uint256 prevIdx = lastIdx - 1;

            // Simple volatility measure: absolute price change percentage
            uint256 priceChange;
            if (marketStates[lastIdx].price > marketStates[prevIdx].price) {
                priceChange = marketStates[lastIdx].price - marketStates[prevIdx].price;
            } else {
                priceChange = marketStates[prevIdx].price - marketStates[lastIdx].price;
            }

            uint256 volatility = priceChange * 10000 / marketStates[prevIdx].price;
            uint256 stability = 10000 - volatility; // Higher is more stable

            // Update cumulative stability (weighted average)
            cumulativeStability = (cumulativeStability * 90 + stability * 10) / 100;
        }

        emit StateUpdated(marketStates.length - 1, price, token.totalSupply());
    }

    /**
     * @dev Apply RL-based action to token parameters
     * @param newAlpha New alpha parameter for ABC
     * @param newR New reserve ratio parameter for ABC
     */
    function applyRlAction(uint256 newAlpha, uint256 newR) external onlyOwner {
        require(rlEnabled, "RL mode not enabled");
        require(newAlpha >= minAlpha && newAlpha <= maxAlpha, "Alpha out of bounds");
        require(newR >= minR && newR <= maxR, "R out of bounds");

        // Apply parameter changes to token contract
        token.updateParameters(newAlpha, newR);

        emit ActionApplied(newAlpha, newR, true);
    }

    /**
     * @dev Apply manual parameter changes (when RL is disabled)
     * @param newAlpha New alpha parameter for ABC
     * @param newR New reserve ratio parameter for ABC
     */
    function applyManualAction(uint256 newAlpha, uint256 newR) external onlyOwner {
        require(!rlEnabled, "Manual mode not enabled");
        require(newAlpha >= minAlpha && newAlpha <= maxAlpha, "Alpha out of bounds");
        require(newR >= minR && newR <= maxR, "R out of bounds");

        // Apply parameter changes to token contract
        token.updateParameters(newAlpha, newR);

        emit ActionApplied(newAlpha, newR, false);
    }

    /**
     * @dev Toggle RL mode
     * @param enabled Whether RL mode should be enabled
     */
    function setRlEnabled(bool enabled) external onlyOwner {
        rlEnabled = enabled;
        emit ModeChanged(enabled);
    }

    /**
     * @dev Update project success and investor return metrics
     * Used by off-chain services to provide feedback on system performance
     * @param _projectSuccessRate New project success rate (0-10000 basis points)
     * @param _investorReturnRate New investor return rate (0-10000 basis points)
     */
    function updateMetrics(uint256 _projectSuccessRate, uint256 _investorReturnRate) external onlyOwner {
        require(_projectSuccessRate <= 10000, "Project success rate too high");
        require(_investorReturnRate <= 10000, "Investor return rate too high");

        projectSuccessRate = _projectSuccessRate;
        investorReturnRate = _investorReturnRate;

        emit MetricsUpdated(cumulativeStability, projectSuccessRate, investorReturnRate);
    }

    /**
     * @dev Get the number of stored market states
     */
    function getMarketStateCount() external view returns (uint256) {
        return marketStates.length;
    }

    /**
     * @dev Get current token parameters
     */
    function getCurrentParameters() external view returns (uint256 alpha, uint256 r) {
        return (token.alpha(), token.r());
    }

    /**
     * @dev Update system parameters
     */
    function updateSystemParameters(
        uint256 _updateInterval,
        uint256 _minAlpha,
        uint256 _maxAlpha,
        uint256 _minR,
        uint256 _maxR
    ) external onlyOwner {
        updateInterval = _updateInterval;
        minAlpha = _minAlpha;
        maxAlpha = _maxAlpha;
        minR = _minR;
        maxR = _maxR;
    }
}