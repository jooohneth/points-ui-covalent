import queryHolders from "./query.js";

import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

const addresses = await queryHolders();

const leaves = addresses.map((addr) => keccak256(addr));

const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

const rootHash = merkleTree.getRoot().toString("hex");
console.log(`Merkle Root: 0x${rootHash}`);
