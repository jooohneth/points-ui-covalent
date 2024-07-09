import { CardHeader, CardTitle } from "@/components/ui/card";
import ConnectButton from "@/components/ConnectButton.jsx";

const Connect = () => {
  return (
    <CardHeader>
      <CardTitle className="mb-10">Connect Wallet</CardTitle>
      <ConnectButton></ConnectButton>
    </CardHeader>
  );
};

export default Connect;
