import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()

app.use(cors({ origin: 'http://localhost:3000' })) // FE주소 ( 추후 환경변수 처리 해야합니다.)

/** 헬스체크 엔드포인트*/
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() })
})

app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express!' })
})

app.listen(4000, () => console.log('Server running on port 4000'))
