import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>问卷调查系统</title>
        <meta name="description" content="问卷调查系统 - 填写端" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>问卷调查系统</h1>
        <p>请通过正确的问卷链接进行填写</p>
      </main>
    </>
  )
}
