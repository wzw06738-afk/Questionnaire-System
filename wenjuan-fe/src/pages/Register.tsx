import React, { FC } from 'react'
import { Typography, Form, Input, Button, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { LOGIN_PATHNAME } from '../router'
import { registerService } from '../services/user'
import styles from './Register.module.scss'

const { Title, Text } = Typography

const Register: FC = () => {
  const nav = useNavigate()

  const { run, loading } = useRequest(
    async values => {
      const { username, password, nickname } = values
      await registerService(username, password, nickname)
    },
    {
      manual: true,
      onSuccess() {
        message.success('注册成功')
        nav(LOGIN_PATHNAME)
      },
      onError(err: any) {
        message.error(err.message || '注册失败')
      }
    }
  )

  const onFinish = (values: any) => {
    run(values)
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.registerCard}>
        <header>
          <Title level={2}>创建账户</Title>
          <Text>注册一个新账户来开始创建问卷</Text>
        </header>

        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="用户名"
            name="username"
            className={styles.formItem}
            rules={[
              { required: true, message: '请输入用户名' },
              { type: 'string', min: 5, max: 20, message: '字符长度在 5-20 之间' },
              { pattern: /^\w+$/, message: '只能是字母数字下划线' },
            ]}
          >
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            className={styles.formItem}
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirm"
            className={styles.formItem}
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="再次输入密码" />
          </Form.Item>
          <Form.Item label="昵称" name="nickname" className={styles.formItem}>
            <Input placeholder="昵称（选填）" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className={styles.submitBtn} loading={loading}>
            注册
          </Button>

          <div className={styles.footerLinks}>
            <Text type="secondary">已有账户？</Text>
            <Link to={LOGIN_PATHNAME}>立即登录</Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Register
