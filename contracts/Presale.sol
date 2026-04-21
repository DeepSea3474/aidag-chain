// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * AIDAG Presale Contract — BSC (BEP-20)
 *
 * Token:        0xe6B06f7C63F6AC84729007ae8910010F6E721041 (AIDAG)
 *
 * Revenue split (automatic, every buy):
 *   60%  → Founder Wallet  0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23
 *   40%  → DAO/Soulware    0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9
 *
 * AIDAG distribution:
 *   - Distribution wallet (0xC16eC985...) transfers AIDAG into this contract
 *     once after deploy (e.g. 5,000,000 AIDAG).
 *   - Each buy() instantly:
 *       1. Splits BNB 60/40 to the two wallets above
 *       2. Sends AIDAG to the buyer at the current stage rate
 *
 * The contract never holds BNB — it forwards immediately. Only AIDAG sits
 * inside until sold or recovered by owner.
 *
 * Owner controls: setStage, setRate, setLimits, setPaused, recoverTokens,
 * setFounderWallet, setDaoWallet, transferOwnership.
 */

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract AIDAGPresale {
    // ── Storage ───────────────────────────────────────────────────────
    address public owner;
    IERC20  public immutable token;

    address payable public founderWallet;   // 60% of BNB
    address payable public daoWallet;       // 40% of BNB
    uint16  public constant FOUNDER_BPS = 6000;  // 60.00%
    uint16  public constant DAO_BPS     = 4000;  // 40.00%
    uint16  public constant BPS_DENOM   = 10000;

    uint256 public tokensPerBnb;       // e.g. 7692 → 1 BNB = 7692 AIDAG @ $0.078
    uint256 public minBuyWei;
    uint256 public maxBuyWei;          // 0 = no per-tx max
    uint256 public hardCapTokens;      // max AIDAG sellable in current stage
    uint256 public soldTokens;
    uint8   public stage;              // 1 or 2; 0 = stopped
    bool    public paused;

    mapping(address => uint256) public boughtTokens;
    mapping(address => uint256) public boughtBnb;

    // ── Events ────────────────────────────────────────────────────────
    event Bought(address indexed buyer, uint256 bnbWei, uint256 aidagAmount, uint8 stage);
    event Split(uint256 founderShare, uint256 daoShare);
    event Refunded(address indexed buyer, uint256 bnbWei);
    event TokensRecovered(address indexed to, uint256 amount);
    event StageChanged(uint8 newStage, uint256 newTokensPerBnb, uint256 newHardCap);
    event PauseChanged(bool paused);
    event FounderWalletChanged(address indexed newWallet);
    event DaoWalletChanged(address indexed newWallet);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ── Modifiers ─────────────────────────────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // ── Constructor ───────────────────────────────────────────────────
    constructor(uint256 _tokensPerBnb, uint256 _hardCapTokens) {
        require(_tokensPerBnb > 0, "Zero rate");
        require(_hardCapTokens > 0, "Zero cap");

        owner          = msg.sender;
        token          = IERC20(0xe6B06f7C63F6AC84729007ae8910010F6E721041);
        founderWallet  = payable(0xFf01Fa9D5d1e5FCc539eFB9654523A657F32ed23);
        daoWallet      = payable(0xC16eC985D98Db96DE104Bf1e39E1F2Fdb9a712E9);
        tokensPerBnb   = _tokensPerBnb;
        hardCapTokens  = _hardCapTokens;
        minBuyWei      = 0.01 ether;
        maxBuyWei      = 0;
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

        uint256 aidagAmount = bnbWei * tokensPerBnb;
        require(aidagAmount > 0, "Zero amount");

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

        // Interactions — AIDAG to buyer
        require(token.transfer(buyer, aidagAmount), "AIDAG transfer failed");

        // 60/40 split — forward BNB immediately
        uint256 founderShare = (bnbWei * FOUNDER_BPS) / BPS_DENOM;
        uint256 daoShare     = bnbWei - founderShare;
        (bool okF, ) = founderWallet.call{value: founderShare}("");
        require(okF, "Founder transfer failed");
        (bool okD, ) = daoWallet.call{value: daoShare}("");
        require(okD, "DAO transfer failed");
        emit Split(founderShare, daoShare);

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

    function setFounderWallet(address payable w) external onlyOwner {
        require(w != address(0), "Zero");
        founderWallet = w;
        emit FounderWalletChanged(w);
    }

    function setDaoWallet(address payable w) external onlyOwner {
        require(w != address(0), "Zero");
        daoWallet = w;
        emit DaoWalletChanged(w);
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
