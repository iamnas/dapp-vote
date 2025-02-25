// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Vote} from "../src/Vote.sol";

contract VoteTest is Test {
    Vote vote;
    address admin = address(1);
    address voter1 = address(2);
    address voter2 = address(3);
    address unregisteredVoter = address(4);

    function setUp() public {
        vm.prank(admin);
        vote = new Vote();
    }

    function test_RegisterVoter() public {
        vm.prank(admin);
        vote.registerVoter(voter1);
        (bool registered, bool hasVoted) = vote.voters(voter1);
        assertTrue(registered);
        assertFalse(hasVoted);
    }

    function testFail_RegisterVoter_NotAdmin() public {
        vm.prank(voter1); // Not admin
        vote.registerVoter(voter2); // Should fail
    }

    function test_AddCandidate() public {
        vm.prank(admin);
        vote.addCandidate("Alice");
        (string memory name, uint256 voteCount) = vote.getCandidate(1);
        assertEq(name, "Alice");
        assertEq(voteCount, 0);
    }

    function testFail_AddCandidate_NotAdmin() public {
        vm.prank(voter1);
        vote.addCandidate("Bob"); // Should fail
    }

    function test_Vote() public {
        vm.prank(admin);
        vote.registerVoter(voter1);
        vm.prank(admin);
        vote.addCandidate("Alice");

        vm.prank(voter1);
        vote.vote(1);

        (, bool hasVoted) = vote.voters(voter1);
        assertTrue(hasVoted);

        (, uint256 voteCount) = vote.getCandidate(1);
        assertEq(voteCount, 1);
    }

    function testFail_Vote_UnregisteredVoter() public {
        vm.prank(unregisteredVoter);
        vote.vote(1); // Should fail
    }

    function testFail_Vote_Twice() public {
        vm.startPrank(admin);
        vote.registerVoter(voter1);
        vote.addCandidate("Alice");
        vm.stopPrank();

        vm.prank(voter1);
        vote.vote(1);

        vm.prank(voter1);
        vote.vote(1); // Should fail
    }

    function test_GetLeader() public {
        vm.startPrank(admin);
        vote.registerVoter(voter1);
        vote.registerVoter(voter2);
        vote.addCandidate("Alice");
        vote.addCandidate("Bob");
        vm.stopPrank();

        vm.prank(voter1);
        vote.vote(1); // Alice gets 1 vote

        vm.prank(voter2);
        vote.vote(2); // Bob gets 1 vote

        (string memory leaderName, uint256 highestVotes) = vote.getLeader();
        assertEq(keccak256(abi.encodePacked(leaderName)), keccak256(abi.encodePacked("Alice"))); // Alice should lead (first voter wins ties)
        assertEq(highestVotes, 1);
    }
}
