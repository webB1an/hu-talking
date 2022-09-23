import express from 'express'
import cooker from './cooker'
import air from './air'
import type { Router } from 'express'

const router: Router = express.Router()

router.use('/cooker', cooker)
router.use('/air', air)

export default router
