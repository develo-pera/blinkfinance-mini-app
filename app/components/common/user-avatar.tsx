import { Context } from "@farcaster/miniapp-sdk";
import { useAvatar, useName } from "@coinbase/onchainkit/identity";
import { mainnet } from "wagmi/chains";
import { Address, Chain } from "viem";
import { ScanFace } from "lucide-react";
import { Loader } from "./loader";

const UserAvatar = ({ user, address, onClick }: { user?: Context.UserContext, address?: Address, onClick?: () => void }) => {
  const { data: name, isLoading: isNameLoading, error: nameError } = useName({ address: address as `0x${string}`, chain: mainnet as Chain });
  const { data: avatar, isLoading: isAvatarLoading, error: avatarError } = useAvatar({ ensName: name as string, chain: mainnet as Chain });

  if (user && user?.pfpUrl) {
    return (
      <div onClick={onClick}>
        <img className="w-8 h-8 rounded-full" src={user.pfpUrl} alt="use profile phot" />
      </div>
    )
  }

  if (isNameLoading || isAvatarLoading) {
    return <Loader className="w-8 h-8 rounded-full" />;
  }

  if (avatar) {
    return <img className="w-8 h-8 rounded-full" src={avatar} alt="use profile phot" />;
  }

  return (
    <ScanFace className="w-8 h-8 text-foreground stroke-[1.5px] opacity-70" />
  )
};

export default UserAvatar;