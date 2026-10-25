import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Space, Table, Typography } from 'antd';
import React from 'react';
import { listUsers } from '@/services/social/api';

export default function UsersPage() {
  const query = useQuery({ queryKey: ['users'], queryFn: listUsers });
  return (
    <Space orientation="vertical" style={{ width: '100%' }}>
      <Typography.Title level={2}>用户管理</Typography.Title>
      <Typography.Text>显示最近创建的 100 个账号</Typography.Text>
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
        columns={['id', 'username', 'nickname', 'role', 'status'].map((key) => ({ title: key, dataIndex: key }))}
      />
    </Space>
  );
}
