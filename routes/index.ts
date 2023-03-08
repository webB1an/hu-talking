import express from 'express'
import chat from './chat'
// import cooker from './cooker'
// import air from './air'
// import keyboard from './keyboard'
import type { Router } from 'express'

const router: Router = express.Router()

router.use('/chatgpt', chat)
// router.use('/cooker', cooker)
// router.use('/air', air)
// router.use('/keyboard', keyboard)

export default router
