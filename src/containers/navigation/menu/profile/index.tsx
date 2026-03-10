'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

import AccountContent from './account';
import SavedAreasContent from './saved-areas';
import SubscriptionsContent from './subscriptions';

const Profile = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl leading-8 font-light text-black/85">My profile</h2>

      <Tabs defaultValue="account" className="min-w-119 space-y-6">
        <TabsList className="w-full gap-2">
          <TabsTrigger value="account" className="flex-1">
            Account
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex-1">
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="saved-areas" className="flex-1">
            Saved areas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountContent />
        </TabsContent>
        <TabsContent value="subscriptions">
          <SubscriptionsContent />
        </TabsContent>
        <TabsContent value="saved-areas">
          <SavedAreasContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
