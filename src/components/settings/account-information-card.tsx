import { getCurrentUser } from '@/lib/auth';
import { StandardCard } from '@/components/standard-card';
import { MutedSubheader } from '../muted-subheader';

export async function AccountInformationCard() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <StandardCard
      title="Account Information"
      description="Your account details"
      className="lg:w-1/2"
    >
      <div className="space-y-4">
        <div className="flex md:flex-row gap-4 flex-col">
          <div className="md:w-1/2">
            <MutedSubheader label="Email" />
            <p>{user.email}</p>
          </div>
          <div className="flex md:w-1/2 w-full">
            <div className="w-1/2">
              <MutedSubheader label="Role" />
              <p className="capitalize">{user.role}</p>
            </div>
            <div className="w-1/2">
              <MutedSubheader label="Member Since" />
              <p>{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>
    </StandardCard>
  );
}
