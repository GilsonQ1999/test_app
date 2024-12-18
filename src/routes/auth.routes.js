import {
    Router
} from 'express'
const router = Router()

import * as authCtrl from '../controllers/auth.controller'

import {
    verifyToken
} from '../middlewars'

router.get('/frm_registroUsuario/add', authCtrl.obtenerFrmUsuario)

router.post('/signup/add', authCtrl.signUp)

router.get('/frm_inicioUsuario/add', authCtrl.obtenerFrmUsuIni)

router.post('/signin/add', authCtrl.signIn)
module.exports = router;