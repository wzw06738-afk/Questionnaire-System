import PageWrapper from '@/components/PageWrapper'

export default function Success() {
  return <PageWrapper title="提交成功">
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 16, color: '#10b981' }}>&#10003;</div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>提交成功</h1>
      <p style={{ color: '#6b7280', fontSize: 15 }}>感谢您的参与！</p>
    </div>
  </PageWrapper>
}
