import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Space, Table, Typography } from 'antd';
import React from 'react';
import { listAudit } from '@/services/social/api';

export default function AuditPage() {
  const query = useQuery({ queryKey: ['audit'], queryFn: listAudit });
  return (
    <Space orientation="vertical" style={{ width: '100%' }}>
      <Typography.Title level={2}>操作审计</Typography.Title>
      <Typography.Text>显示最近 100 条审核记录</Typography.Text>
      <Button
        onClick={() => {
          void query.refetch();
        }}
      >
        刷新
      </Button>
      {query.error ? <Alert type="error" title={query.error.message} /> : null}
      <Table
        rowKey="id"
        loading={query.isFetching}
        dataSource={query.data?.data ?? []}
        columns={['actorId', 'action', 'targetId', 'reason', 'createdAt'].map((key) => ({
          title: key,
          dataIndex: key,
        }))}
      />
    </Space>
  );
}
