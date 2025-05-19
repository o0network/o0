# Tokenomics with Reinforcement Learning

This project implements an advanced tokenomics system that balances the interests of investors and projects using reinforcement learning. The system combines Augmented Bonding Curves (ABC) and Quadratic Funding (QF) with a Deep Q-Network (DQN) to create a responsive and balanced tokenomics model.

## System Components

### 1. Smart Contracts

- **EthDonations.sol**: Base contract for collecting ETH donations
- **TokenABC.sol**: Token contract implementing Augmented Bonding Curve with dynamic parameters
- **TokenomicsController.sol**: Controller contract for applying RL decisions to the token parameters

### 2. Reinforcement Learning

- **dqn_model.py**: Deep Q-Network implementation with environment simulation to train the RL agent

## Tokenomics Model

The tokenomics model combines several key mechanisms:

### Augmented Bonding Curve (ABC)

The ABC defines the relationship between token supply and price:

P(s) = α · s^β, where β = 1/(1-r)

- s: Current token supply
- α: Base price coefficient (adjustable parameter)
- r: Reserve ratio (adjustable parameter)
- P(s): Token price at supply s

### Quadratic Funding (QF)

QF determines project valuation based on collective contributions:

C̃ = Σc_i + (Σc_i)²

- c_i: Individual contributions
- C̃: Project valuation

### Proof of Stake (PoS)

Agents stake tokens when making predictions about project success. Their stake changes based on prediction accuracy:

s_j' = {
  s_j(1+ρ), if prediction is correct
  s_j(1-σ), if prediction is incorrect
}

### Dynamic Locking

Tokens are locked until their price exceeds the purchase price:

L(t) = {
  1, if P(s_t) < P(s_t0)
  0, if P(s_t) >= P(s_t0)
}

## Reinforcement Learning Integration

The RL agent acts as a "central bank" for the tokenomics system:

### State Space

The agent observes:
- Current token price
- Token supply
- Trading volume
- Buy/sell ratio
- TVL (Total Value Locked)
- QF valuation
- Price stability metrics
- Project success rate
- Investor return rate

### Action Space

The agent adjusts two key parameters:
- α (alpha): Base price coefficient of the ABC
- r: Reserve ratio of the ABC

### Reward Function

The reward balances three components:
- Price stability (20% weight)
- Investor returns (weighted by investor_weight)
- Project success (weighted by 1-investor_weight)

## How It Works

1. The TokenABC contract implements a token with dynamic parameters that follow the ABC formula
2. Users can buy/sell tokens, contribute to projects (QF), and stake tokens (PoS)
3. The TokenomicsController collects market data and project metrics
4. The RL agent (DQN) processes this data and recommends parameter adjustments
5. These adjustments are applied to the TokenABC contract, creating a feedback loop

## Performance Comparison

The system can compare performance with and without RL-based adjustments:
- Price stability
- Project success rates
- Investor returns

The RL-based system typically achieves better balance between investor interests and project needs compared to a static parameter approach.

## Usage

The smart contracts can be deployed on an Ethereum-compatible blockchain. The RL model is trained offline using historical or synthetic DEX data, and the resulting model is used to guide parameter adjustments in the TokenomicsController.

## Requirements

- Solidity 0.8.27
- Python 3.8+
- PyTorch
- Pandas, Numpy, Matplotlib
- Foundry for contract deployment and testing
