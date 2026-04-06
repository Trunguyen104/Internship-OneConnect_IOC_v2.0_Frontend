'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Inbox, LayoutGrid, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internship-group.service';
import Card from '@/components/ui/card';
import PageLayout from '@/components/ui/pagelayout';
import SearchBar from '@/components/ui/searchbar';
import { Spinner } from '@/components/ui/spinner';
import StatusBadge from '@/components/ui/status-badge';
import { ENTERPRISE_DASHBOARD_UI } from '@/constants/enterprise-dashboard/uiText';

export default function MentorGroupsDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const texts = ENTERPRISE_DASHBOARD_UI.MENTOR_GROUPS;

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['mentor-groups'],
    queryFn: async () => {
      const res = await InternshipGroupService.getAll({ pageSize: 100 }, { silent: true });
      return res?.data?.items || res?.data || [];
    },
  });

  const filteredGroups = groups.filter((group) => {
    const name = group.groupName?.toLowerCase() || '';
    const enterprise = group.enterpriseName?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || enterprise.includes(query);
  });

  const handleGroupClick = (groupId) => {
    if (!groupId) return;
    router.push(`/internship-groups/${groupId}/space`);
  };

  return (
    <PageLayout className="p-0">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">{texts.TITLE}</h1>
        <p className="font-medium text-slate-500">{texts.SUBTITLE}</p>
      </div>

      <div className="flex items-center justify-between gap-4 py-2">
        <SearchBar
          placeholder={texts.SEARCH_PLACEHOLDER}
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
          width="w-full max-w-md"
        />
      </div>

      <PageLayout.Content className="mt-8">
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group, index) => {
              const groupId =
                group.id ||
                group.internshipID ||
                group.internshipId ||
                group.internshipGroupId ||
                group.internshipid;

              return (
                <Card
                  key={groupId || index}
                  className="group relative flex cursor-pointer flex-col overflow-hidden border-gray-100 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)]"
                  onClick={() => handleGroupClick(groupId)}
                >
                  <Card.Header className="items-start pb-4">
                    <div className="flex flex-1 flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <StatusBadge
                          variant={group.status === 2 ? 'neutral' : 'success'}
                          variantType="boxed"
                          label={group.status === 2 ? texts.CHIP_ARCHIVED : texts.CHIP_ACTIVE}
                          showDot
                        />
                        <span className="text-[10px] font-mono text-slate-300">
                          {texts.ID_PREFIX}
                          {groupId?.substring(0, 8)}
                        </span>
                      </div>
                      <Card.Title className="text-xl font-black text-slate-900 transition-colors group-hover:text-primary">
                        {group.groupName}
                      </Card.Title>
                      <Card.Description className="font-bold text-slate-400 line-clamp-1">
                        {group.enterpriseName || 'No enterprise assigned'}
                      </Card.Description>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(var(--primary-rgb),0.3)]">
                      <LayoutGrid className="size-6" />
                    </div>
                  </Card.Header>

                  <Card.Content className="py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-slate-100 transition-colors">
                          <Users className="size-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-lg font-black leading-none text-slate-900">
                            {group.numberOfMembers || 0}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {texts.STUDENTS}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card.Content>

                  <Card.Footer className="mt-2 border-t border-slate-50 pt-4 transition-colors group-hover:bg-slate-50/50">
                    <span className="flex w-full items-center justify-between font-black text-primary transition-all duration-500">
                      <span className="translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                        {texts.VIEW_DETAILS}
                      </span>
                      <ArrowRight className="-translate-x-4 transition-all duration-500 group-hover:translate-x-0" />
                    </span>
                  </Card.Footer>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[40px] border border-dashed border-slate-200 bg-slate-50/30 p-12 text-center animate-in fade-in duration-700">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl ring-8 ring-slate-50">
              <Inbox className="size-10 text-slate-300" />
            </div>
            <h3 className="mb-2 text-xl font-black text-slate-900">{texts.EMPTY_STATE}</h3>
            <p className="max-w-xs font-medium text-slate-400">{texts.EMPTY_STATE_DESC}</p>
          </div>
        )}
      </PageLayout.Content>
    </PageLayout>
  );
}
