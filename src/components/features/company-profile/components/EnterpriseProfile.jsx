import { ProfileInfoPanel } from './ProfileInfoPanel';
import { ProfileOverviewCard } from './ProfileOverviewCard';
import { ProfileSummaryCard } from './ProfileSummaryCard';

export function EnterpriseProfile({ profile, onEdit, onLogoChange, onBannerChange }) {
  return (
    <div className="flex flex-col gap-10 pb-16">
      <ProfileSummaryCard
        profile={profile}
        onEdit={onEdit}
        onLogoChange={onLogoChange}
        onBannerChange={onBannerChange}
      />

      <main className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
        <div className="flex h-full min-h-0 flex-col lg:col-span-2">
          <ProfileOverviewCard profile={profile} onEdit={onEdit} />
        </div>

        <div className="flex h-full min-h-0 flex-col">
          <ProfileInfoPanel profile={profile} />
        </div>
      </main>
    </div>
  );
}
