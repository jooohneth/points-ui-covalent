"use client";

import { useState, useEffect } from "react";
import ConnectWallet from "@/components/ConnectWallet.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useWriteContract,
  useReadContracts,
  useAccount,
  useDisconnect,
} from "wagmi";
import Image from "next/image";
import Elegibility from "@/components/Eligibility.jsx";
import Claim from "@/components/Claim.jsx";
import { abi } from "@/lib/abi.json";

import queryHolders from "@/scripts/query.js";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

const Home = () => {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const { data: hash, isPending, writeContract } = useWriteContract();

  const [step, setStep] = useState(25);
  const [proof, setProof] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    getHolders();
  }, []);

  useEffect(() => {
    getProof(account.address);
  }, [addresses]);

  const getHolders = async () => {
    const data = await queryHolders();
    setAddresses(data);
  };

  const getProof = async (address) => {
    const leaves = addresses.map((addr) => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const proof = merkleTree.getHexProof(keccak256(address));
    setProof(proof);
  };

  const claimPoints = () => {
    writeContract({
      address: "0x07474DbEa92e5450C324B8d9d2633128c29a855d",
      abi: abi,
      functionName: "claim",
      args: [proof, account.address],
    });
    // writeContract({
    //   address: "0x07474DbEa92e5450C324B8d9d2633128c29a855d",
    //   abi: abi,
    //   functionName: "modifyRoot",
    //   args: [
    //     "0x31dde0d57dac2e4b49ff12b1e68379854fe475d3da08b2b4537318f12bf2d79c",
    //   ],
    // });
  };

  const handleBack = () => {
    step == 25 && disconnect();

    step > 25 &&
      setStep((prevState) => {
        return prevState - 25;
      });
  };

  const handleNext = () => {
    step < 100 &&
      setStep((prevState) => {
        return prevState + 25;
      });
  };

  const { data } = useReadContracts({
    contracts: [
      {
        address: "0x07474DbEa92e5450C324B8d9d2633128c29a855d",
        abi: abi,
        functionName: "claimed",
        args: [account.address],
        chainId: 5003,
      },
      {
        address: "0x07474DbEa92e5450C324B8d9d2633128c29a855d",
        abi: abi,
        functionName: "checkEligibility",
        args: [proof, account.address],
        chainId: 5003,
      },
    ],
  });
  const [claimed, eligible] = data || [];

  useEffect(() => {
    console.log(`Eligible: ${eligible?.result}`);
    console.log(`Claimed: ${claimed?.result}`);
  }, [eligible, claimed]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('/bgbg.png')] bg-center">
      <div className="flex flex-col justify-center items-center">
        <Card>
          <CardHeader className="">
            <Image
              src="/mantle_logo.png"
              alt="Description of image"
              width={!account.isConnected ? 250 : 150}
              height={!account.isConnected ? 250 : 150}
            />
            <CardTitle>
              {step <= 25 && "Pudgy Points"}
              {step == 50 &&
                (eligible?.result || claimed?.result
                  ? "You're Eligible!"
                  : "Not Eligible!")}
              {step == 75 &&
                (!claimed?.result && eligible?.result
                  ? "Claim Points"
                  : "You've Claimed!")}
              {step == 100 && (claimed?.result ? "Congrats!" : "")}
            </CardTitle>
            <CardDescription>
              {!account.isConnected && "Connect wallet. "}
              {step == 100 &&
                (claimed?.result ? "You've claimed your points!" : "")}
              {step == 25 && "Check your elegibility and claim."}
              {step == 50 &&
                (eligible?.result || claimed?.result
                  ? "Click 'Next' and Claim your points!"
                  : "If you think we're wrong, try refreshing the page!")}
              {step == 75 &&
                (eligible?.result && !claimed?.result
                  ? "Claim your points using the button bellow!"
                  : "")}
            </CardDescription>

            {step <= 25 && <ConnectWallet></ConnectWallet>}
          </CardHeader>
          {account.isConnected && (
            <div>
              {step == 50 && (
                <CardContent>
                  <Elegibility
                    eligible={eligible?.result}
                    claimed={claimed?.result}
                  ></Elegibility>
                </CardContent>
              )}
              {step == 75 && (
                <CardContent>
                  <Claim
                    eligible={eligible?.result}
                    claimed={claimed?.result}
                    claimPoints={claimPoints}
                    isPending={isPending}
                    hash={hash}
                  ></Claim>
                </CardContent>
              )}

              <CardFooter className="flex flex-col items-center ">
                <div className="mb-5 px-10 w-[100%] flex flex-row items-center justify-between">
                  <Button onClick={handleBack}>Back</Button>
                  <div className="font-extrabold">
                    {step == 25 && "1 / 4"}
                    {step == 50 && "2 / 4"}
                    {step == 75 && "3 / 4"}
                    {step == 100 && "Finish!"}
                  </div>
                  <Button
                    disabled={
                      (eligible?.result && !claimed?.result && step == 75) ||
                      (!eligible?.result && !claimed?.result && step == 50)
                        ? true
                        : false
                    }
                    className={
                      (eligible?.result && !claimed?.result && step == 75) ||
                      (!eligible?.result && !claimed?.result && step == 50)
                        ? "border-zinc-400 text-zinc-400 hover:border-zinc-400 hover:bg-white hover:text-zinc-400"
                        : ""
                    }
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </div>

                <Progress value={step} className="w-[90%]" />
              </CardFooter>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Home;
