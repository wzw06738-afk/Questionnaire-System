import axios, { ResDataType } from './ajax'

// AI 生成问卷
export async function aiGenerateService(prompt: string): Promise<ResDataType> {
  const url = '/api/ai/generate'
  const data = (await axios.post(url, { prompt })) as ResDataType
  return data
}
