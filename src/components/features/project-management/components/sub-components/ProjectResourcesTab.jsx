'use client';

import { FileOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import React from 'react';

export default function ProjectResourcesTab({
  internalDocs,
  legacyAttachments,
  quickLinks,
  legacyLinks,
  hasDocs,
  hasLinks,
  DETAIL,
}) {
  return (
    <div className="space-y-8 pt-4">
      <section>
        <h4 className="mb-4 font-bold text-gray-800 border-l-4 border-primary pl-3 uppercase text-[10px] flex items-center justify-between tracking-widest">
          {DETAIL.SECTIONS?.RESOURCES}
          <span className="text-[9px] font-bold text-slate-400 italic uppercase tracking-tighter">
            {DETAIL.SECTIONS?.RESOURCES_HINT}
          </span>
        </h4>
        {hasDocs ? (
          <div className="space-y-3">
            {[...internalDocs, ...legacyAttachments].map((item, idx) => (
              <div
                key={`doc-${idx}`}
                className="flex items-center justify-between p-3 hover:bg-primary/5 rounded-xl border border-slate-100 hover:border-primary/10 transition-all bg-slate-50/30"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FileOutlined className="text-lg text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-700">
                      {item.resourceName || item.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {item.resourceType === 1
                        ? DETAIL.RESOURCES?.INTERNAL
                        : DETAIL.RESOURCES?.EXTERNAL}
                    </div>
                  </div>
                </div>
                <Button
                  type="primary"
                  ghost
                  size="small"
                  onClick={() => window.open(item.resourceUrl || item.url, '_blank')}
                  className="rounded-lg font-bold text-[10px] uppercase tracking-widest h-8"
                >
                  {DETAIL.RESOURCES?.ACCESS}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 italic text-sm bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
            {DETAIL.SECTIONS?.NO_RESOURCES}
          </div>
        )}
      </section>

      <section>
        <h4 className="mb-4 font-bold text-gray-800 border-l-4 border-emerald-400 pl-3 uppercase text-[10px] tracking-widest">
          {DETAIL.SECTIONS?.LINKS}
        </h4>
        {hasLinks ? (
          <div className="flex flex-wrap gap-3">
            {quickLinks.map((link, idx) => (
              <Tag
                key={`pj-res-${idx}`}
                icon={<LinkOutlined />}
                color="processing"
                className="cursor-pointer py-2 px-4 hover:scale-105 transition-all rounded-xl border-none font-bold shadow-sm bg-blue-50 text-blue-600"
                onClick={() => window.open(link.resourceUrl || link.url, '_blank')}
              >
                {link.resourceName || link.title || link.url}
              </Tag>
            ))}
            {legacyLinks.map((link, idx) => (
              <Tag
                key={`res-link-${idx}`}
                icon={<LinkOutlined />}
                color="processing"
                className="cursor-pointer py-2 px-4 hover:scale-105 transition-all rounded-xl border-none font-bold shadow-sm bg-blue-50 text-blue-600"
                onClick={() => window.open(link.url, '_blank')}
              >
                {link.title || link.url}
              </Tag>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 italic text-sm bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
            {DETAIL.SECTIONS?.NO_LINKS}
          </div>
        )}
      </section>
    </div>
  );
}
