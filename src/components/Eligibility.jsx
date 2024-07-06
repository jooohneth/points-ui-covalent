"use client";

import { useEffect } from "react";

const Eligibility = ({ eligible, claimed }) => {
  useEffect(() => {
    console.log(eligible, claimed);
  }, []);

  // if (isPending) return <div>Pending...</div>;

  // if (error) return <div>Error: {error.shortMessage || error.message}</div>;
  if (eligible || claimed)
    return (
      <div className="flex flex-col items-center justify-center mb-10">
        <div className="text-3xl font-extrabold">Allocation: 100 $MNT</div>
      </div>
    );
};

export default Eligibility;
