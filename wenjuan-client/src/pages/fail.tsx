import PageWrapper from '@/components/PageWrapper'

export default function Fail() {
  return <PageWrapper title="提交失败">
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 16, color: '#ef4444' }}>&#10007;</div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>提交失败</h1>
      <p style={{ color: '#6b7280', fontSize: 15 }}>问卷提交失败，请稍后重试</p>
    </div>
  </PageWrapper>
}
