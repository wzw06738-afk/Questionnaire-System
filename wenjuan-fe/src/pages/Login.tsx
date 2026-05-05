import React, { FC, useEffect, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Typography, Space, Form, Input, Button, Checkbox, message, ConfigProvider, theme as antTheme } from 'antd'
import { UserOutlined, LockOutlined, SafetyCertificateOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { useDispatch } from 'react-redux'
import { REGISTER_PATHNAME, MANAGE_INDEX_PATHNAME } from '../router'
import { loginService, getUserInfoService } from '../services/user'
import { setToken } from '../utils/user-token'
import { loginReducer } from '../store/userReducer'
import useTheme from '../hooks/useTheme'
import styles from './Login.module.scss'

const { Title, Text } = Typography

const USERNAME_KEY = 'USERNAME'

// --- Helpers ---
function rememberUser(username: string) {
  localStorage.setItem(USERNAME_KEY, username)
}

function deleteUserFromStorage() {
  localStorage.removeItem(USERNAME_KEY)
}

function getUsernameFromStorage() {
  return localStorage.getItem(USERNAME_KEY)
}

// Simple captcha generator
const generateCaptcha = () => Math.random().toString(36).substring(2, 6).toUpperCase()

const Login: FC = () => {
  const nav = useNavigate()
  const dispatch = useDispatch()
  const { theme: appTheme, toggleTheme } = useTheme()
  const [form] = Form.useForm()
  const [captcha, setCaptcha] = useState(generateCaptcha())

  // --- Effects ---
  useEffect(() => {
    const username = getUsernameFromStorage()
    form.setFieldsValue({ username })
  }, [form])

  // --- Request ---
  const { run, loading } = useRequest(
    async (username: string, password: string) => {
      const data = await loginService(username, password)
      return data
    },
    {
      manual: true,
      async onSuccess(result) {
        const { token = '' } = result
        setToken(token)

        try {
          const { username, nickname } = await getUserInfoService()
          dispatch(loginReducer({ username, nickname }))
          message.success('登录成功')
          nav(MANAGE_INDEX_PATHNAME)
        } catch (err) {
          message.error('获取用户信息失败')
        }
      },
      onError(err: any) {
        message.error(err.message || '登录失败，请检查用户名或密码')
        setCaptcha(generateCaptcha()) // Refresh captcha on error
      }
    }
  )

  // --- Handlers ---
  const onFinish = (values: any) => {
    const { username, password, remember, captchaInput = '' } = values || {}

    if (captchaInput.toUpperCase() !== captcha) {
      message.error('验证码错误')
      setCaptcha(generateCaptcha())
      return
    }

    run(username, password)

    if (remember) {
      rememberUser(username)
    } else {
      deleteUserFromStorage()
    }
  }

  // --- Render ---
  return (
    <ConfigProvider
      theme={{
        algorithm: appTheme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 8,
        },
      }}
    >
      <div className={styles.pageWrapper}>
        <Button 
          className={styles.themeToggle} 
          icon={appTheme === 'dark' ? <BulbOutlined /> : <BulbFilled />} 
          onClick={toggleTheme}
          shape="circle"
          aria-label={appTheme === 'dark' ? '切换为亮色模式' : '切换为暗色模式'}
        />
        
        <div className={`${styles.loginCard} ${styles.staggeredReveal}`}>
          <header>
            <Title level={2}>欢迎回来</Title>
            <Text>请登录您的账户以管理问卷</Text>
          </header>

          <Form
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            form={form}
            requiredMark={false}
          >
            <Form.Item
              label="用户名 / 邮箱"
              name="username"
              className={styles.formItem}
              rules={[
                { required: true, message: '请输入用户名或邮箱' },
                { min: 3, message: '长度不能少于 3 个字符' },
              ]}
            >
              <Input prefix={<UserOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="用户名或邮箱" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              className={styles.formItem}
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="您的密码" />
            </Form.Item>

            <Form.Item
              label="验证码"
              name="captchaInput"
              className={styles.formItem}
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <div className={styles.captchaWrapper}>
                <Input prefix={<SafetyCertificateOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="验证码" />
                <div className={styles.captchaImage} onClick={() => setCaptcha(generateCaptcha())} title="点击刷新">
                  {captcha}
                </div>
              </div>
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ fontSize: '14px', color: 'var(--color-primary)' }}>忘记密码？</Link>
            </div>

            <Button type="primary" htmlType="submit" className={styles.submitBtn} loading={loading}>
              登录
            </Button>

            <div className={styles.footerLinks}>
              <Text type="secondary">还没有账户？</Text>
              <Link to={REGISTER_PATHNAME}>立即注册</Link>
            </div>
          </Form>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default Login
