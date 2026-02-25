'use client';

import Link from 'next/link';

import cn from '@/lib/classnames';

import { TAB_TRIGGER_STYLE, Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';

import AccountContent from './account';
import SavedAreasContent from './saved-areas';
import SubscriptionsContent from './subscriptions';

const Profile = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl leading-[32px] font-light text-black/85">My profile</h2>

      <Tabs defaultValue="account" className="min-w-[476px] space-y-6">
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
          <Link
            href={
              process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
                ? process.env.NEXT_PUBLIC_MRTT_SITE_PROD
                : process.env.NEXT_PUBLIC_MRTT_SITE_STAGING
            }
            className={cn(TAB_TRIGGER_STYLE, 'flex-1')}
          >
            MRTT
          </Link>
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
