import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Input, Space, Table, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import { listPosts, moderate, type SocialPost } from '@/services/social/api';

export default function ModerationPage() {
  const [status, setStatus] = useState('pending');
  const [cursor, setCursor] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['posts', status, cursor],
    queryFn: () => listPosts(status, cursor),
  });
  const mutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: 'published' | 'hidden' }) => moderate(id, next, reason),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ['posts'] });
      await client.invalidateQueries({ queryKey: ['audit'] });
    },
  });
  const columns = [
    { title: '作者', dataIndex: 'nickname' },
    { title: '内容', dataIndex: 'body' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (value: string) => new Date(value).toLocaleString(),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, row: SocialPost) => (
        <Space>
          {row.status === 'pending' ? (
            <Button
              disabled={!reason.trim() || mutation.isPending}
              onClick={() => mutation.mutate({ id: row.id, next: 'published' })}
            >
              通过
            </Button>
          ) : null}
          {row.status !== 'hidden' ? (
            <Button
              danger
              disabled={!reason.trim() || mutation.isPending}
              onClick={() => mutation.mutate({ id: row.id, next: 'hidden' })}
            >
              下架
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];
  return (
    <Space orientation="vertical" style={{ width: '100%' }}>
      <Typography.Title level={2}>内容审核</Typography.Title>
      <Space>
        {[
          ['pending', '待审核'],
          ['published', '已发布'],
          ['hidden', '已下架'],
        ].map(([value, label]) => (
          <Button
            key={value}
            type={status === value ? 'primary' : 'default'}
            onClick={() => {
              setStatus(value);
              setCursor(null);
              mutation.reset();
            }}
          >
            {label}
          </Button>
        ))}
        <Button
          onClick={() => {
            void query.refetch();
          }}
        >
          刷新
        </Button>
      </Space>
      <Input
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        maxLength={500}
        placeholder="填写审核原因后操作，将写入审计记录"
        aria-label="审核原因"
      />
      {query.error || mutation.error ? (
        <Alert type="error" title={(query.error ?? mutation.error)?.message} showIcon />
      ) : null}
      <Table<SocialPost>
        rowKey="id"
        columns={columns}
        dataSource={query.data?.data.items ?? []}
        loading={query.isFetching}
        pagination={false}
      />
      <Space>
        <Button disabled={!cursor} onClick={() => setCursor(null)}>
          返回第一页
        </Button>
        <Button
          disabled={!query.data?.data.nextCursor || query.isFetching}
          onClick={() => setCursor(query.data?.data.nextCursor ?? null)}
        >
          下一页
        </Button>
      </Space>
    </Space>
  );
}
