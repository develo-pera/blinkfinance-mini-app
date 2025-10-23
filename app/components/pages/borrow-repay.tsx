import { ActivePage } from "@/app/page";
import { Button } from "@/components/ui/button";

const BorrowRepayPage = ({ activePage, setActivePage }: { activePage: ActivePage, setActivePage: (page: ActivePage) => void }) => {
  return (
    <div className="px-4 flex flex-col flex-1">
      <h1>{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page</h1>
      <Button onClick={() => setActivePage("home")} className="w-full rounded-xl bg-[var(--bf-card-background)] text-foreground">Go back</Button>
    </div>
  );
};

export default BorrowRepayPage;