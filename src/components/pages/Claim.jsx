import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect } from "react";

const Claim = ({
  claimed,
  claimPoints,
  isPending,
  hash,
  isConfirming,
  isConfirmed,
  error,
}) => {
  useEffect(() => {
    console.log(error?.message);
  }, [error]);

  return (
    <div>
      <CardContent>
        <CardTitle>
          {claimed
            ? "Already Claimed!"
            : error?.message.includes("Invalid proof!")
            ? "Not Eligible!"
            : "Get Powder"}
        </CardTitle>

        <CardDescription>
          Check your eligibility and Claim Powder.
        </CardDescription>

        <Button
          disabled={isPending || isConfirming || (claimed ? true : false)}
          onClick={claimPoints}
          className={`px-10 py-5 ${
            isPending ||
            isConfirming ||
            (claimed &&
              "border-zinc-400 text-zinc-400 hover:border-zinc-400 hover:bg-white hover:text-zinc-400")
          }`}
        >
          {isPending ? "Confirming..." : "Check and Claim"}
        </Button>
        {hash && (
          <Link
            className={`mt-5 text-sm text-zinc-500 underline`}
            href={`https://sepolia.mantlescan.xyz/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {isConfirming && "Pending..."}
            {isConfirmed && "Claimed!"}
          </Link>
        )}
      </CardContent>
    </div>
  );
};

export default Claim;
