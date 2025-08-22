import TransfersDashboard from '@/components/dashboard/transfers-dashboard';
import { getTransfers } from '@/lib/data';
import SubNavigation from '@/components/dashboard/sub-navigation';

export default async function TransfersPage() {
  const transfers = await getTransfers();
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <SubNavigation />
      <TransfersDashboard initialTransfers={transfers} />
    </div>
  );
}
