import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Claim = ({ eligible, claimed, claimPoints, isPending, hash }) => {
  useEffect(() => {
    console.log(eligible, claimed, hash);
  }, []);

  if (eligible && !claimed)
    return (
      <div className="flex flex-col justify-center items-center">
        <Button
          disabled={isPending}
          onClick={claimPoints}
          className="px-10 py-4"
        >
          {isPending ? "Wait..." : "Claim"}
        </Button>
        {hash && (
          <Link
            className="mt-5 text-sm text-zinc-500"
            href={`https://sepolia.mantlescan.xyz/tx/${hash}`}
          >
            View Transaction
          </Link>
        )}
      </div>
    );
};

export default Claim;
