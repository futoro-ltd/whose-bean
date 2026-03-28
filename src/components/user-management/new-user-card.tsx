import { UserPlus, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/styled-tabs';
import { StandardCard } from '../standard-card';
import { CreateUserForm } from './create-user-form';
import { InviteUserForm } from './invite-user-form';

export function NewUserCard() {
  const tabList = (
    <TabsList>
      <TabsTrigger value="create" className="gap-2">
        <UserPlus />
        <span className="md:flex hidden">Create User</span>
      </TabsTrigger>
      <TabsTrigger value="invite" className="gap-2">
        <Mail />
        <span className="md:flex hidden">Invite User</span>
      </TabsTrigger>
    </TabsList>
  );

  return (
    <Tabs defaultValue="create">
      <StandardCard title="New User" tabs={tabList}>
        <TabsContent value="create">
          <CreateUserForm />
        </TabsContent>
        <TabsContent value="invite">
          <InviteUserForm />
        </TabsContent>
      </StandardCard>
    </Tabs>
  );
}
