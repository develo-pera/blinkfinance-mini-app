import { Button } from "@/components/ui/button";
import { Context } from "@farcaster/miniapp-sdk";
import Image from "next/image";
import { LogOut } from "lucide-react";

const ProfilePage = ({ user }: { user?: Context.UserContext }) => {
  return (
    <div className="px-4 flex flex-col flex-1">
      <div className="mt-10 px-4">
        <h1 className="text-2xl font-bold">Petar Popovic</h1>
        <p>developera.eth</p>

        <p className="text-sm text-gray-500">petar@ethbelgrade.rs</p>
      </div>

      <div className="mt-10 p-4 bg-[var(--bf-card-background)] rounded-2xl">
        <h2 className="text-3xl">Your Company</h2>
        <div className="mt-5 bg-[var(--bf-light-green)] dark:bg-[var(--bf-dark-purple)] rounded-xl p-4">
          <div className="flex items-start justify-between gap-5">
            <p className="font-bold">Blockops doo</p>
            <Image src="https://joobpool-production.s3.amazonaws.com/ETH%20Belgrade/eth-bdg.jpg" alt="company logo" width={50} height={50} className="rounded-sm" />
          </div>
          <div className="mt-15 text-sm">
            <p>VAT: 1234567890</p>
            <p>Reg. No: 1234567890</p>
            <p>Address: 123 Main St, Anytown, USA</p>
          </div>
        </div>
      </div>

      <Button onClick={() => console.log("Logout me")} className="mt-auto w-full rounded-xl">
        <LogOut className="w-4h-4" /> Log out
      </Button>
    </div>
  );
};

export default ProfilePage;