import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConnectButton from "@/components/ConnectButton.jsx";

const Connected = () => {
  return (
    <CardHeader>
      <CardTitle>Crystal Powder</CardTitle>
      <CardDescription>
        Wallet Connected! Check your eligibility and Claim.
      </CardDescription>
      <ConnectButton></ConnectButton>
    </CardHeader>
  );
};

export default Connected;
