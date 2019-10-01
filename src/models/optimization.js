const defaultProps = {
  range: 50
}

class Optimization {
  constructor(props = defaultProps) {
    /** Range */
    this.range = props.range || 50
    /** Alíquota de ICMS % */
    this.pICMS = props.pICMS || 0
    /** PIS/COFINS (histórico de 12 meses) */
    this.pPC = props.pPC || Array(12).fill(0)
    /** Demanda Medida Ponta (histórico de 12 meses) */
    this.DLP = props.DLP || Array(12).fill(0)
    /** Demanda Medida Fora Ponta (histórico de 12 meses) */
    this.DLF = props.DLF || Array(12).fill(0)
    /** Demanda Contratada Ponta (histórico de 12 meses) */
    this.DCP = props.DCP || Array(12).fill(0)
    /** Demanda Contratada Fora Ponta (histórico de 12 meses) */
    this.DCF = props.DCF || Array(12).fill(0)
    /** Horas Ponta para o período calculado */
    this.Hp = props.Hp || Array(12).fill(0)

    /** Tarifa de Demanda Ponta */
    this.TDPa = props.TDPa || 0
    /** Tarifa de Demanda Fora Ponta */
    this.TDFa = props.TDFa || 0
    /** Tarifa de Uso do Sistema de Distribuição Ponta (R$/MWh) */
    this.TusdPa = props.TusdPa || 0
    /** Tarifa de Uso do Sistema de Distribuição Fora Ponta (R$/MWh) */
    this.TusdFa = props.TusdFa || 0
    /** Tarifa de Energia Ponta */
    this.TEPa = props.TEPa || 0
    /** Tarifa de Energia Fora Ponta */
    this.TEFa = props.TEFa || 0

    /** Tarifa de Demanda Ponta */
    this.TDPv = props.TDPv || 0
    /** Tarifa de Demanda Fora Ponta */
    this.TDFv = props.TDFv || 0
    /** Tarifa de Uso do Sistema de Distribuição Ponta (R$/MWh) */
    this.TusdPv = props.TusdPv || 0
    /** Tarifa de Uso do Sistema de Distribuição Fora Ponta (R$/MWh) */
    this.TusdFv = props.TusdFv || 0
    /** Tarifa de Energia Ponta */
    this.TEPv = props.TEPv || 0
    /** Tarifa de Energia Fora Ponta */
    this.TEFv = props.TEFv || 0
    /** Custo do Gerador no horário de Ponta (Em R$/kWh) */
    this.CGPv = props.CGPv || 0
  }
  fnSearchDI(arr) {
    const CustoDI = Math.min(...arr.slice().map(a => a.Custo))
    return arr.find(v => v.Custo === CustoDI)
  }
  fnHpm(mi) {
    return this.Hp[mi - 1]
  }
  fnpPCm(mi) {
    return this.pPC[mi - 1]
  }
  fnDLPm(mi) {
    return this.DLP[mi - 1]
  }
  fnDLFm(mi) {
    return this.DLF[mi - 1]
  }
  fnDCPm(mi) {
    return this.DCP[mi - 1]
  }
  fnDCFm(mi) {
    return this.DCF[mi - 1]
  }
  fnDLPmin() {
    return Math.min(...this.DLP)
  }
  fnDLPmax() {
    return Math.max(...this.DLP)
  }
  fnDLFmin() {
    return Math.min(...this.DLF)
  }
  fnDLFmax() {
    return Math.max(...this.DLF)
  }
  /** Demanda Ponta Ideal (ver fórmula 2.a) */
  fnDPIi(TDP, DCPi) {
    let Custo = 0
    const CustoMensal = []
    for(let mi = 1; mi <= 12; mi++) {
      const ConditionOne = this.fnDLPm(mi)/DCPi > 1.05 ? (this.fnDLPm(mi) - DCPi) * 2 : 0
      const a = Math.max(this.fnDLPm(mi), DCPi) + ConditionOne
      const b = 1 - (this.pICMS + this.fnpPCm(mi))
      const eq = (TDP * a) / b
      CustoMensal.push(eq)
      Custo += eq
    }
    return { DLP: DCPi, Custo, CustoMensal }
  }
  fnDPI(TDP) {
    const ArrCustoDCP = []
    const x = this.fnDLPmin() - this.range
    const y = this.fnDLPmax() + this.range
    for (let DCPi = x; DCPi <= y; DCPi++) {
      const responseDCPi = this.fnDPIi(TDP, DCPi)
      ArrCustoDCP.push(responseDCPi)
    }
    const DI = this.fnSearchDI(ArrCustoDCP)
    return { DI, ArrCustoDCP }
  }
  /** Demanda Fora Ponta Ideal (Ver fórmula 2.b) */
  fnDFIi(TDF, DCFi) {
    let Custo = 0
    const CustoMensal = []
    for(let mi = 1; mi <= 12; mi++) {
      const ConditionOne = this.fnDLFm(mi)/DCFi > 1.05 ? (this.fnDLFm(mi) - DCFi) * 2 : 0
      const a = Math.max(this.fnDLFm(mi), DCFi) + ConditionOne
      const b = 1 - (this.pICMS + this.fnpPCm(mi))
      const eq = (TDF * a) / b
      CustoMensal.push(eq)
      Custo += eq
    }
    return { DLF: DCFi, Custo, CustoMensal }
  }
  fnDFI(TDF) {
    const ArrCustoDCF = []
    const x = this.fnDLFmin() - this.range
    const y = this.fnDLFmax() + this.range
    for (let DCFi = x; DCFi <= y; DCFi++) {
      const responseDCFi = this.fnDFIi(TDF, DCFi)
      ArrCustoDCF.push(responseDCFi)
    }
    const DI = this.fnSearchDI(ArrCustoDCF)
    return { DI, ArrCustoDCF }
  }
  /** Tarifa de Ultrapassagem demanda Ponta (ver fórmula 2.c) */
  fnUltPm(mi) {
    return fnDLPm(mi)/fnDCPm(mi) > 1.05 ? (fnDLPm(mi) - fnDCPm(mi)) * 2 : 0
  }
  fnUltP() {
    const UltP = []
    for(let mi = 1; mi <= 12; mi++) {
      UltP.push(fnUltPm(mi))
    }
    return UltP
  }
  /** Tarifa de Ultrapassagem demanda Fora Ponta (ver fórmula 2.c) */
  fnUltFm(mi) {
    return fnDLFm(mi)/fnDCFm(mi) > 1.05 ? (fnDLFm(mi) - fnDCFm(mi)) * 2 : 0
  }
  fnUltF() {
    const UltF = []
    for(let mi = 1; mi <= 12; mi++) {
      UltF.push(fnUltFm(mi))
    }
    return UltF
  }
  /** 3.a Calculo de custo para cada modalidade (Custo Azul) */
  fnCustoAm(mi) {
    const a = this.TDPa * (fnDCPm(mi) + 2 * fnUltPm(mi))
    const b = this.TDFa * (fnDCFm(mi) + 2 * fnUltFm(mi))
    const c = fnDCPm(mi) * (this.TusdPa + this.TEPa)
    const d = fnDCFm(mi) * (this.TusdFa + this.TEFa)
    const x = a + b + c + d
    const y = 1 - (this.pICMS + fnpPCm(mi))
    return x / y
  }
  /** 3.a Calculo de custo para cada modalidade (Custo Verde) */
  fnCustoVm(mi) {
    const a = this.TDPv * (fnDCPm(mi) + 2 * fnUltPm(mi))
    const b = this.TDFv * (fnDCFm(mi) + 2 * fnUltFm(mi))
    const c = fnDCPm(mi) * (this.TusdPv + this.TEPv)
    const d = fnDCFm(mi) * (this.TusdFv + this.TEFv)
    const e = fnDCPm(mi) * this.CGPv * (1 - (this.pICMS + fnpPCm(mi)))
    const x = a + b + c + d + e
    const y = 1 - (this.pICMS + fnpPCm(mi))
    return x / y
  }
  /** Modalidade Tarifária Ótima (ver fórmula 3.b) */
  fnMTO(mi) {
    return Math.max(fnCustoAm(mi), fnCustoVm(mi))
  }
  /** Fator de BreakEven da Mod. tarifária no mês i (ver fórmula 3.c) */ 
  fnFmod(mi) {
    const a = this.CGPv * (1 - (this.pICMS + fnpPCm(mi)))
    const b = this.TDPa / (this.TusdPv - this.TusdPa + a )
    const c = 1 / fnHpm(mi)
    return b * c
  }
}

export default Optimization

// export default () => {
//   const month = [1,2,3,4,5,6,7,8,9,10,11,12]
//   const DCPi = DCPm(12)
//   const DCFi = DCFm(12)
//   // Verde Ponta
//   const { DI: DPIv, ArrCustoDCP: ArrCustoDCPv } = fnDPI(TDPv)
//   const DCPv = ArrCustoDCPv.find(p => p.DLP === DCPi)
//   // Verde Fora Ponta
//   const { DI: DFIv, ArrCustoDCF: ArrCustoDCFv } = fnDFI(TDFv)
//   const DCFv = ArrCustoDCFv.find(p => p.DLF === DCFi)
//   // Azul Ponta
//   const { DI: DPIa, ArrCustoDCP: ArrCustoDCPa } = fnDPI(TDPa)
//   const DCPa = ArrCustoDCPa.find(p => p.DLP === DCPi)
//   // Azul Fora Ponta
//   const { DI: DFIa, ArrCustoDCF: ArrCustoDCFa } = fnDFI(TDFa)
//   const DCFa = ArrCustoDCFa.find(p => p.DLF === DCFi)

//   return {
//     Verde: {
//       Custo: month.map(fnCustoVm),
//       Ponta: {
//         Ganho: DCPv.Custo - DPIv.Custo,
//         DCP: DCPv,
//         DPI: DPIv,
//         allDCP: ArrCustoDCPv.map(({ DLP, Custo }) => ({ DLP, Custo }))
//       },
//       ForaPonta: {
//         Ganho: DCFv.Custo - DFIv.Custo,
//         DCF: DCFv,
//         DFI: DFIv,
//         allDCF: ArrCustoDCFv.map(({ DLF, Custo }) => ({ DLF, Custo }))
//       }
//     },
//     Azul: {
//       Custo: month.map(fnCustoAm),
//       Ponta: {
//         Ganho: DCPa.Custo - DPIa.Custo,
//         DCP: DCPa,
//         DPI: DPIa,
//         allDCP: ArrCustoDCPa.map(({ DLP, Custo }) => ({ DLP, Custo }))
//       },
//       ForaPonta: {
//         Ganho: DCFa.Custo - DFIa.Custo,
//         DCF: DCFa,
//         DFI: DFIa,
//         allDCF: ArrCustoDCFa.map(({ DLF, Custo }) => ({ DLF, Custo }))
//       }
//     },
//     UltP: fnUltP(),
//     UltF: fnUltF(),
//     MTO: month.map(MTO),
//     BreakEven: month.map(Fmod)
//   }
// }
