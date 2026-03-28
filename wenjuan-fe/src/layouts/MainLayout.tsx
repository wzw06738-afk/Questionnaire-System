import React, { FC, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout, Spin } from 'antd'
import Logo from '../components/Logo'
import UserInfo from '../components/UserInfo'
import useLoadUserData from '../hooks/useLoadUserData'
import useNavPage from '../hooks/useNavPage'
import styles from './MainLayout.module.scss'

const { Header, Content, Footer } = Layout

const MainLayout: FC = () => {
  const { waitingUserData } = useLoadUserData()
  useNavPage(waitingUserData)

  return (
    <Layout>
      <Header className={styles.header}>
        <div className={styles.left}>
          <Logo />
        </div>
        <div className={styles.right}>
          <UserInfo />
        </div>
      </Header>
      <Layout className={styles.main}>
        <Content>
          {waitingUserData ? (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <Spin />
            </div>
          ) : (
            <Suspense
              fallback={
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                  <Spin />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          )}
        </Content>
      </Layout>
      <Footer className={styles.footer}>仿问卷星问卷;2025.6 - present. Created by 吴卫哲</Footer>
    </Layout>
  )
}

export default MainLayout
