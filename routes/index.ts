import express from 'express'
import cooker from './cooker'
import type { Router } from 'express'

const router: Router = express.Router()

router.use('/cooker', cooker)

export default router
