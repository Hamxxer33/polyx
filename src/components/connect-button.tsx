import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { HAS_APPKIT } from "@/lib/wallet";
import { Wallet } from "@/components/icons";
import { short } from "@/lib/format";

type Props = { demo: boolean; className?: string };

export function ConnectButton(props: Props) {
  if (HAS_APPKIT && !props.demo) return <AppKitButton {...props} />;
  return <InjectedButton {...props} />;
}

function AppKitButton({ className }: Props) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  return (
    <button type="button" className={className} onClick={() => void open({ view: isConnected ? "Account" : "Connect" })}>
      <Wallet className="size-[18px]" />
      {isConnected && address ? short(address) : "Connect wallet"}
    </button>
  );
}

/** Browser wallet (or the demo mock) when no WalletConnect project id is set. */
function InjectedButton({ className }: Props) {
  const { connectors, connectAsync, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [note, setNote] = useState<string | null>(null);
  return (
    <>
      <button
        type="button"
        className={className}
        disabled={isPending}
        onClick={async () => {
          setNote(null);
          if (isConnected) return disconnect();
          const c = connectors[0];
          if (!c) return setNote("No wallet found in this browser.");
          try {
            await connectAsync({ connector: c });
          } catch {
            setNote("No wallet found in this browser. Paste your address instead.");
          }
        }}
      >
        <Wallet className="size-[18px]" />
        {isConnected && address ? `Disconnect ${short(address)}` : isPending ? "Connecting…" : "Connect wallet"}
      </button>
      {note ? <p className="mt-2 text-[13px] text-warn">{note}</p> : null}
    </>
  );
}
