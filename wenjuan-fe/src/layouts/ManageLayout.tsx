import React, { FC, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Button, Space, Divider, Modal, Input, message } from 'antd'
import { PlusOutlined, BarsOutlined, StarOutlined, DeleteOutlined, RobotOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { createQuestionService } from '../services/question'
import { aiGenerateService } from '../services/ai'
import styles from './ManageLayout.module.scss'

const ManageLayout: FC = () => {
  const nav = useNavigate()
  const { pathname } = useLocation()

  const [modalOpen, setModalOpen] = useState(false)
  const [prompt, setPrompt] = useState('')

  const { loading, run: handleCreateClick } = useRequest(createQuestionService, {
    manual: true,
    onSuccess(result) {
      nav(`/question/edit/${result.id}`)
      message.success('创建成功')
    },
  })

  const { loading: aiLoading, run: handleAiGenerate } = useRequest(
    () => aiGenerateService(prompt),
    {
      manual: true,
      onSuccess(result) {
        setModalOpen(false)
        setPrompt('')
        nav(`/question/edit/${result.id}`)
        message.success('AI 创建成功')
      },
    }
  )

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Space direction="vertical">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
            disabled={loading}
          >
            新建问卷
          </Button>
          <Button
            size="large"
            icon={<RobotOutlined />}
            onClick={() => setModalOpen(true)}
          >
            AI 创建
          </Button>
          <Divider style={{ borderTop: 'transparent' }} />
          <Button
            type={pathname.startsWith('/manage/list') ? 'default' : 'text'}
            size="large"
            icon={<BarsOutlined />}
            onClick={() => nav('/manage/list')}
          >
            我的问卷
          </Button>
          <Button
            type={pathname.startsWith('/manage/star') ? 'default' : 'text'}
            size="large"
            icon={<StarOutlined />}
            onClick={() => nav('/manage/star')}
          >
            星标问卷
          </Button>
          <Button
            type={pathname.startsWith('/manage/trash') ? 'default' : 'text'}
            size="large"
            icon={<DeleteOutlined />}
            onClick={() => nav('/manage/trash')}
          >
            回收站
          </Button>
        </Space>
      </div>
      <div className={styles.right}>
        <Outlet />
      </div>

      <Modal
        title="AI 创建问卷"
        open={modalOpen}
        onOk={handleAiGenerate}
        onCancel={() => { setModalOpen(false); setPrompt('') }}
        confirmLoading={aiLoading}
        okText="生成"
        cancelText="取消"
      >
        <Input.TextArea
          rows={4}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="请描述你想创建的问卷，例如：创建一个关于用户满意度的调查问卷，包含姓名、年龄、满意度评分（1-5）和建议反馈"
        />
      </Modal>
    </div>
  )
}

export default ManageLayout
