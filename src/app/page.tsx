"use client";

import { useState, useEffect } from "react";
import Connect from "@/components/pages/Connect.jsx";
import Connected from "@/components/pages/Connected.jsx";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  useWriteContract,
  useReadContracts,
  useAccount,
  useDisconnect,
  useWaitForTransactionReceipt,
} from "wagmi";
import Image from "next/image";
import Claim from "@/components/pages/Claim.jsx";
import { abi } from "@/abi.json";

import queryHolders from "@/scripts/query.js";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

const Home = () => {
  const covalentKey = process.env.NEXT_PUBLIC_COVALENT_API_KEY;

  const account = useAccount();
  const { disconnect } = useDisconnect();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const [step, setStep] = useState(50);
  const [proof, setProof] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    getHolders(covalentKey);
    console.log(process.env.NEXT_PUBLIC_COVALENT_API_KEY);
  }, []);

  useEffect(() => {
    getProof(account.address);
  }, [addresses]);

  const handleBack = () => {
    step == 50 && disconnect();

    step > 50 &&
      setStep((prevState) => {
        return prevState - 50;
      });
  };

  const handleNext = () => {
    step < 99 &&
      setStep((prevState) => {
        return prevState + 50;
      });
  };

  const getHolders = async (key: string | undefined) => {
    const data = await queryHolders(key);
    setAddresses(data);
  };

  const getProof = async (address: `0x${string}` | undefined) => {
    const leaves = addresses.map((addr) => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const proof = merkleTree.getHexProof(keccak256(address));
    setProof(proof);
  };

  const claimPoints = () => {
    // writeContract({

    //   abi: abi,
    //   functionName: "claim",
    //   args: [proof, account.address],
    // });

    writeContract({
      address: "0xdF9f2829D17bB0850Ce18e48aE2F02bc521F302A",
      abi: abi,
      functionName: "modifyRoot",
      args: [
        "0x31dde0d57dac2e4b49ff12b1e68379854fe475d3da08b2b4537318f12bf2d79c",
      ],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const { data } = useReadContracts({
    contracts: [
      {
        address: "0x07474DbEa92e5450C324B8d9d2633128c29a855d",
        abi: abi,
        functionName: "claimed",
        args: [account.address],
        chainId: 5003,
      },
    ],
  });
  const [claimed] = data || [];

  return (
    <div className="flex justify-center items-center min-h-screen bg-center">
      <div className="flex flex-col justify-center items-center">
        <Card>
          <Image
            src="/mantle_logo.png"
            alt="Description of image"
            width={150}
            height={150}
            className="mx-auto mb-10"
          />

          {!account.isConnected && <Connect></Connect>}

          {account.isConnected && (
            <div>
              {step == 50 && <Connected></Connected>}

              {step == 100 && (
                <Claim
                  claimed={claimed?.result}
                  claimPoints={claimPoints}
                  isPending={isPending}
                  hash={hash}
                  isConfirming={isConfirming}
                  isConfirmed={isConfirmed}
                  error={error}
                ></Claim>
              )}

              <CardFooter className="flex flex-col items-center pt-10">
                <div className="mb-5 px-10 w-[100%] flex flex-row items-center justify-between">
                  <Button onClick={handleBack}>Back</Button>

                  {step != 100 && (
                    <Button
                      disabled={!claimed?.result && step == 100 ? true : false}
                      className={
                        !claimed?.result && step == 100
                          ? "border-zinc-400 text-zinc-400 hover:border-zinc-400 hover:bg-white hover:text-zinc-400"
                          : ""
                      }
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  )}
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
