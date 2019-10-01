import { Router } from 'express'
import {
  calculateDPI,
  calculateDPIbyDCPi,
  calculateDFI,
  calculateDFIbyDCFi
} from '../controllers/optimization'

const isNumber = number => {
  if (isNaN(number)) {
    throw new Error('Not a number found')
  }
  return Number(number)
}

const isArrayOfNumbers = numbers => {
  let arr
  if (typeof numbers === 'string') {
    arr = numbers.split(',')
  }
  if (!Array.isArray(arr)) {
    throw new Error('Not array')
  }
  return arr.map(v => Number(isNumber(v)))
}

const router = Router()
/**
 * @api {get} /optimization/dpi?dlp=:dlp&ppc=:ppc&picms=:picms&tdpa=:tdpa&tdpv=:tdpv
 * @apiName DPI
 * @apiGroup Optimization
 *
 * @apiParam {Number} :dcpi Demanda Contratada Ponta (variável).
 * @apiParam {Number[]} :dlp Demanda Medida Ponta (histórico de 12 meses).
 * @apiParam {Number[]} :ppc PIS/COFINS (histórico de 12 meses).
 * @apiParam {Number} :picms Alíquota de ICMS %.
 * @apiParam {Number} :tdpa Tarifa de Demanda Ponta (azul).
 * @apiParam {Number} :tdpv Tarifa de Demanda Ponta (verde).
 *
 * @apiSuccess {Object} data Calculation result.
 * @apiSuccess {Object} query Input data.
 */
router.get('/dpi/:dcpi?', async (req, res, next) => {
  let DLP, pPC, pICMS, TDPa, TDPv, DCPi
  try {
    DLP = req.query.dlp && isArrayOfNumbers(req.query.dlp)
    pPC = req.query.ppc && isArrayOfNumbers(req.query.ppc)
    pICMS = req.query.picms && isNumber(req.query.picms)
    TDPa = req.query.tdpa && isNumber(req.query.tdpa)
    TDPv = req.query.tdpv && isNumber(req.query.tdpv)
    DCPi = req.params.dcpi && isNumber(req.params.dcpi)
  } catch (e) {
    res.status(400)
    return next(e)
  }
  const query = { DLP, pPC, pICMS, TDPa, TDPv, DCPi }
  try {
    let data
    if (DCPi) { 
      data = calculateDPIbyDCPi(query)
    }
    if (!DCPi) {
      data = calculateDPI(query)
    }
    return res.send({ data, query })
  } catch (e) {
    return next(e)
  }
})
/**
 * @api {get} /optimization/dfi?dlf=:dlf&ppc=:ppc&picms=:picms&tdfa=:tdfa&tdfv=:tdfv
 * @apiName DFI
 * @apiGroup Optimization
 *
 * @apiParam {Number} :dcfi Demanda Contratada Fora Ponta (variável).
 * @apiParam {Number[]} :dlf Demanda Medida Fora Ponta (histórico de 12 meses).
 * @apiParam {Number[]} :ppc PIS/COFINS (histórico de 12 meses).
 * @apiParam {Number} :picms Alíquota de ICMS %.
 * @apiParam {Number} :tdfa Tarifa de Demanda Fora Ponta (azul).
 * @apiParam {Number} :tdfv Tarifa de Demanda Fora Ponta (verde).
 *
 * @apiSuccess {Object} data Calculation result.
 * @apiSuccess {Object} query Input data.
 */
router.get('/dfi/:dcfi?', async (req, res, next) => {
  let DLF, pPC, pICMS, TDFa, TDFv, DCFi
  try {
    DLF = req.query.dlf && isArrayOfNumbers(req.query.dlf)
    pPC = req.query.ppc && isArrayOfNumbers(req.query.ppc)
    pICMS = req.query.picms && isNumber(req.query.picms)
    TDFa = req.query.tdfa && isNumber(req.query.tdfa)
    TDFv = req.query.tdfv && isNumber(req.query.tdfv)
    DCFi = req.params.dcfi && isNumber(req.params.dcfi)
  } catch (e) {
    res.status(400)
    return next(e)
  }
  const query = { DLF, pPC, pICMS, TDFa, TDFv, DCFi }
  try {
    let data
    if (DCFi) { 
      data = calculateDFIbyDCFi(query)
    }
    if (!DCFi) {
      data = calculateDFI(query)
    }
    return res.send({ data, query })
  } catch (e) {
    return next(e)
  }
})

export default router
