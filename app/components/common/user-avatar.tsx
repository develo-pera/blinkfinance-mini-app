import { Context } from "@farcaster/miniapp-sdk";
import { Avatar } from "@coinbase/onchainkit/identity";
import { base } from "wagmi/chains";
import { Address, Chain } from "viem";
import { Loader } from "./loader";

const DefaultComponent = () => (<div className="h-10 w-10 mt-[-1px] ml-[-1px] rounded-full bg-[var(--bf-green)]" />);

const UserAvatar = ({ user, address, onClick }: { user?: Context.UserContext, address?: Address, onClick?: () => void }) => {

  if (user && user?.pfpUrl) {
    return (
      <div onClick={onClick}>
        <img className="w-10 h-10 rounded-full" src={user.pfpUrl} alt="use profile phot" />
      </div>
    )
  }

  if (address) {
    return (

      // Note: margin top and left -1px is fix for border radius issue in Avatar component from Base onchainkit library.
      <div onClick={onClick}>
        <Avatar
          address={address}
          chain={base as Chain}
          className="!h-10 !w-10"
          loadingComponent={(
            <Loader className="h-10 w-10 mt-[-1px] ml-[-1px] rounded-full" />
          )}
          defaultComponent={(
            <DefaultComponent />
          )}
        />
      </div>
    )
  }

  return (
    <DefaultComponent />
  )
};

export default UserAvatar;