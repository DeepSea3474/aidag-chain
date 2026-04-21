// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * AIDAG Presale Contract — BSC (BEP-20)
 *
 * Token:        0xe6B06f7C63F6AC84729007ae8910010F6E721041 (AIDAG)
 * Distribution: 0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9 (holds 17.999M AIDAG)
 * Founder Lock: 0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23 (3.001M, 1y lock)
 *
 * How it works:
 *   1. Deployer (you) deploys this contract with the AIDAG token address.
 *   2. Distribution wallet calls AIDAG.transfer(presale, 5_000_000e18) to fund it.
 *   3. Buyers call buy() with BNB → contract instantly sends them AIDAG at the
 *      current stage price. Excess BNB above hardCap is refunded.
 *   4. Owner can call withdraw() any time to pull collected BNB.
 *   5. Owner can call setStage() to switch between Stage 1 ($0.078) and
 *      Stage 2 ($0.098) prices. Listing price ($0.12) ends the presale.
 *   6. Owner can call recoverTokens() to pull leftover AIDAG after presale.
 *
 * Pricing math:
 *   - Stage 1: 1 AIDAG = $0.078
 *   - We use a BNB/USD oracle-free formula by setting tokensPerBnb directly.
 *     Owner updates tokensPerBnb from the dashboard when BNB price changes.
 *     Example: If BNB = $600 and stage1 = $0.078 → tokensPerBnb = 7692
 */

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract AIDAGPresale {
    // ── Storage ───────────────────────────────────────────────────────
    address public owner;
    IERC20  public immutable token;

    uint256 public tokensPerBnb;       // e.g. 7692 means 1 BNB → 7692 AIDAG
    uint256 public minBuyWei;          // minimum BNB per buy (wei)
    uint256 public maxBuyWei;          // maximum BNB per buy (wei, 0 = no limit)
    uint256 public hardCapTokens;      // max AIDAG sellable in current stage (18d)
    uint256 public soldTokens;         // total AIDAG sold so far (18d)
    uint8   public stage;              // 1 = Stage 1, 2 = Stage 2, 0 = paused
    bool    public paused;

    mapping(address => uint256) public boughtTokens;   // per-buyer total
    mapping(address => uint256) public boughtBnb;      // per-buyer BNB total

    // ── Events ────────────────────────────────────────────────────────
    event Bought(address indexed buyer, uint256 bnbWei, uint256 aidagAmount, uint8 stage);
    event Refunded(address indexed buyer, uint256 bnbWei);
    event Withdrawn(address indexed to, uint256 bnbWei);
    event TokensRecovered(address indexed to, uint256 amount);
    event StageChanged(uint8 newStage, uint256 newTokensPerBnb, uint256 newHardCap);
    event PauseChanged(bool paused);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ── Modifiers ─────────────────────────────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // ── Constructor ───────────────────────────────────────────────────
    constructor(address _token, uint256 _tokensPerBnb, uint256 _hardCapTokens) {
        require(_token != address(0), "Zero token");
        require(_tokensPerBnb > 0, "Zero rate");

        owner          = msg.sender;
        token          = IERC20(_token);
        tokensPerBnb   = _tokensPerBnb;
        hardCapTokens  = _hardCapTokens;
        minBuyWei      = 0.01 ether;     // ~$6 at $600 BNB; you can set higher
        maxBuyWei      = 0;              // 0 = no per-tx max
        stage          = 1;
        paused         = false;

        emit OwnershipTransferred(address(0), msg.sender);
        emit StageChanged(1, _tokensPerBnb, _hardCapTokens);
    }

    // ── Buy ───────────────────────────────────────────────────────────
    receive() external payable { _buy(msg.sender, msg.value); }
    function buy() external payable { _buy(msg.sender, msg.value); }

    function _buy(address buyer, uint256 bnbWei) internal {
        require(!paused, "Paused");
        require(stage == 1 || stage == 2, "Not active");
        require(bnbWei >= minBuyWei, "Below min");
        require(maxBuyWei == 0 || bnbWei <= maxBuyWei, "Above max");

        // Compute AIDAG amount: bnbWei * tokensPerBnb (since both 18 decimals it cancels)
        uint256 aidagAmount = bnbWei * tokensPerBnb;
        require(aidagAmount > 0, "Zero amount");

        // Refund overflow if would exceed hard cap
        uint256 remaining = hardCapTokens > soldTokens ? hardCapTokens - soldTokens : 0;
        require(remaining > 0, "Sold out");

        uint256 refund = 0;
        if (aidagAmount > remaining) {
            uint256 usableBnb = remaining / tokensPerBnb;
            refund = bnbWei - usableBnb;
            bnbWei = usableBnb;
            aidagAmount = remaining;
        }

        // Effects
        soldTokens          += aidagAmount;
        boughtTokens[buyer] += aidagAmount;
        boughtBnb[buyer]    += bnbWei;

        // Interactions
        require(token.transfer(buyer, aidagAmount), "AIDAG transfer failed");
        if (refund > 0) {
            (bool ok, ) = payable(buyer).call{value: refund}("");
            require(ok, "Refund failed");
            emit Refunded(buyer, refund);
        }

        emit Bought(buyer, bnbWei, aidagAmount, stage);
    }

    // ── Owner controls ────────────────────────────────────────────────
    function setStage(uint8 newStage, uint256 newTokensPerBnb, uint256 newHardCapTokens) external onlyOwner {
        require(newStage <= 2, "Invalid stage");
        require(newTokensPerBnb > 0 || newStage == 0, "Zero rate");
        stage         = newStage;
        tokensPerBnb  = newTokensPerBnb;
        hardCapTokens = newHardCapTokens;
        emit StageChanged(newStage, newTokensPerBnb, newHardCapTokens);
    }

    function setRate(uint256 newTokensPerBnb) external onlyOwner {
        require(newTokensPerBnb > 0, "Zero rate");
        tokensPerBnb = newTokensPerBnb;
        emit StageChanged(stage, newTokensPerBnb, hardCapTokens);
    }

    function setLimits(uint256 _minBuyWei, uint256 _maxBuyWei) external onlyOwner {
        minBuyWei = _minBuyWei;
        maxBuyWei = _maxBuyWei;
    }

    function setPaused(bool p) external onlyOwner {
        paused = p;
        emit PauseChanged(p);
    }

    function withdraw(address payable to) external onlyOwner {
        require(to != address(0), "Zero to");
        uint256 bal = address(this).balance;
        require(bal > 0, "Nothing to withdraw");
        (bool ok, ) = to.call{value: bal}("");
        require(ok, "Withdraw failed");
        emit Withdrawn(to, bal);
    }

    function recoverTokens(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Zero to");
        require(token.transfer(to, amount), "Recover failed");
        emit TokensRecovered(to, amount);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ── Views ─────────────────────────────────────────────────────────
    function tokensRemaining() external view returns (uint256) {
        return hardCapTokens > soldTokens ? hardCapTokens - soldTokens : 0;
    }

    function quote(uint256 bnbWei) external view returns (uint256 aidagAmount) {
        return bnbWei * tokensPerBnb;
    }
}
