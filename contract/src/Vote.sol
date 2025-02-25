// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Vote {
    error NotAdmin();
    error AlreadyRegistered();
    error NotRegistered();
    error AlreadyVoted();
    error InvalidCandidate();

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool registered;
        bool hasVoted;
    }

    mapping(address => Voter) public voters;
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidatesCount;

    address public admin;

    event VoterRegistered(address voter);
    event VoterRegistereds(address[] voter);
    event VoteCast(address voter, uint256 candidateId);
    event CandidateAdded(uint256 indexed candidateId, string name);

    modifier onlyAdmin() {
        require(msg.sender == admin, NotAdmin());
        _;
    }

    modifier onlyRegisteredVoters() {
        require(voters[msg.sender].registered, NotRegistered());
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addCandidate(string memory _name) external onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function registerVoter(address _voter) external onlyAdmin {
        require(!voters[_voter].registered, AlreadyRegistered());
        voters[_voter] = Voter(true, false);
        emit VoterRegistered(_voter);
    }

    function registerVoters(address[] memory _voter) external onlyAdmin {
        for (uint256 i = 0; i < _voter.length; i++) {
            require(!voters[_voter[i]].registered, AlreadyRegistered());
            voters[_voter[i]] = Voter(true, false);
        }
        emit VoterRegistereds(_voter);
    }

    function vote(uint256 _candidateId) external onlyRegisteredVoters {
        require(!voters[msg.sender].hasVoted, AlreadyVoted());
        require(_candidateId > 0 && _candidateId <= candidatesCount, InvalidCandidate());

        voters[msg.sender].hasVoted = true;
        candidates[_candidateId].voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    function getCandidate(uint256 _id) external view returns (string memory, uint256) {
        require(_id > 0 && _id <= candidatesCount, InvalidCandidate());
        Candidate storage candidate = candidates[_id];
        return (candidate.name, candidate.voteCount);
    }

    function getAllCandidate() external view returns (Candidate[] memory) {
        Candidate[] memory result = new Candidate[](candidatesCount);

        for (uint256 i = 1; i <= candidatesCount; i++) {
            result[i - 1] =
                Candidate({id: candidates[i].id, name: candidates[i].name, voteCount: candidates[i].voteCount});
        }

        return result;
    }

    function getLeader() external view returns (string memory leaderName, uint256 highestVotes) {
        uint256 maxVotes = 0;
        uint256 leaderId = 0;

        for (uint256 i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                leaderId = i;
            }
        }

        if (leaderId == 0) revert InvalidCandidate(); // No votes yet

        return (candidates[leaderId].name, maxVotes);
    }
}
