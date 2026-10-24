import { getAllUsers } from "@/actions/admin/users";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PageIcons } from "@/lib/icons/page-icons";
import {
  DashboardEmptyState,
  DashboardPanel,
} from "@/components/dashboard/DashboardPanel";
import {
  UsersAdminTable,
  type AdminUserRow,
} from "./UsersAdminTable";

export const dynamic = "force-dynamic";

const Users = async () => {
  const users = await getAllUsers();

  const rows: AdminUserRow[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    walletBalance: user.walletBalance,
    profitBalance: user.profitBalance,
    investmentBalance: user.investmentBalance,
    refcode: user.refcode,
    isVerified: user.isVerified,
    isDisabled: user.isDisabled ?? false,
    tradeMode: user.tradeMode,
    createdAt: user.createdAt.toISOString(),
    kycStatus: user.kycStatus ?? null,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        icon={PageIcons.users}
        title="Users"
        description="Search members, adjust balances, send email, and control account access."
      />

      {rows.length === 0 ? (
        <DashboardEmptyState
          title="No users yet"
          description="New registrations will appear here."
        />
      ) : (
        <DashboardPanel className="p-4 sm:p-6">
          <UsersAdminTable users={rows} />
        </DashboardPanel>
      )}
    </div>
  );
};

export default Users;
