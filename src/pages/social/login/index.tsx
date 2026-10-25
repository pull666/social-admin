import { history, useModel } from '@umijs/max';
import { Alert, Button, Form, Input, Typography } from 'antd';
import React, { useState } from 'react';
import { currentUser, login } from '@/services/social/api';

export default function LoginPage() {
  const { setInitialState } = useModel('@@initialState');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submit = async (values: { username: string; password: string }) => {
    setBusy(true);
    setError('');
    try {
      await login(values);
      const result = await currentUser({ skipErrorHandler: true });
      await setInitialState((state) => ({
        ...state,
        currentUser: result.data,
      }));
      history.replace('/moderation');
    } catch (caught) {
      const failure = caught as {
        response?: { data?: { errorMessage?: string } };
        message?: string;
      };
      setError(failure.response?.data?.errorMessage ?? failure.message ?? '登录失败，请重试');
    } finally {
      setBusy(false);
    }
  };
  return (
    <main style={{ maxWidth: 400, margin: '12vh auto', padding: 24 }}>
      <Typography.Title level={2}>Social 管理后台</Typography.Title>
      <Typography.Paragraph>使用管理员账号登录</Typography.Paragraph>
      {error ? <Alert type="error" title={error} showIcon /> : null}
      <Form layout="vertical" onFinish={submit}>
        <Form.Item name="username" label="管理员账号" rules={[{ required: true }]}>
          <Input autoComplete="username" maxLength={64} />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true }]}>
          <Input.Password autoComplete="current-password" maxLength={128} />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={busy}>
          登录
        </Button>
      </Form>
    </main>
  );
}
