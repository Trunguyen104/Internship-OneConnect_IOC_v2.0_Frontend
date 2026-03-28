'use client';

import { EyeOutlined, FileOutlined, LinkOutlined } from '@ant-design/icons';
import React from 'react';

import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import { EmptyState } from '@/components/ui/emptystate';

export default function ProjectResourcesTab({
  internalDocs,
  legacyAttachments,
  quickLinks,
  legacyLinks,
  hasDocs,
  hasLinks,
  DETAIL,
  onView,
}) {
  return (
    <div className="space-y-8 pt-4 pb-10">
      <section>
        <h4 className="mb-4 font-bold text-gray-800 border-l-4 border-primary pl-3 uppercase text-[10px] flex items-center justify-between tracking-widest">
          {DETAIL.SECTIONS?.RESOURCES}
          <span className="text-[9px] font-bold text-slate-400 italic uppercase tracking-tighter">
            {DETAIL.SECTIONS?.RESOURCES_HINT}
          </span>
        </h4>
        {hasDocs ? (
          <div className="grid gap-3">
            {[...internalDocs, ...legacyAttachments].map((item, idx) => (
              <Card
                key={`doc-${idx}`}
                className="!min-h-0 flex-row items-center justify-between p-3.5 hover:bg-primary/5 hover:border-primary/20 transition-all bg-white shadow-sm border-slate-100 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="bg-primary/5 p-2.5 rounded-xl group-hover:bg-primary/10 transition-colors">
                    <FileOutlined className="text-xl text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-700 truncate max-w-[340px]">
                      {item.resourceName || item.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="primary-soft"
                        size="xs"
                        className="text-[9px] font-bold py-0 h-4"
                      >
                        {String(item.resourceType || '').toUpperCase() === '8' ||
                        String(item.resourceType || '').toUpperCase() === 'LINK'
                          ? DETAIL.RESOURCES?.EXTERNAL
                          : DETAIL.RESOURCES?.INTERNAL}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="primary-soft"
                  onClick={() => onView(item)}
                  className="flex items-center justify-center w-10 h-10 border-none shadow-none rounded-xl hover:scale-105 transition-transform"
                  icon={<EyeOutlined className="text-lg" />}
                />
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title={DETAIL.SECTIONS?.NO_RESOURCES} />
        )}
      </section>

      <section>
        <h4 className="mb-4 font-bold text-gray-800 border-l-4 border-emerald-400 pl-3 uppercase text-[10px] tracking-widest">
          {DETAIL.SECTIONS?.LINKS}
        </h4>
        {hasLinks ? (
          <div className="grid gap-3">
            {[...quickLinks, ...legacyLinks].map((link, idx) => (
              <div
                key={`pj-res-${idx}`}
                onClick={() => {
                  if (link.url) window.open(link.url, '_blank');
                  else onView(link);
                }}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="bg-emerald-50 p-2.5 rounded-xl group-hover:bg-emerald-100 transition-colors">
                    <LinkOutlined className="text-xl text-emerald-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-700 truncate max-w-[380px]">
                      {link.resourceName || link.title || link.url}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium truncate max-w-[380px] mt-0.5">
                      {link.url || link.resourceUrl}
                    </div>
                  </div>
                </div>
                <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 mr-2">
                  <LinkOutlined className="text-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title={DETAIL.SECTIONS?.NO_LINKS} />
        )}
      </section>
    </div>
  );
}
