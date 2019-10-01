import Optimization from '../models/optimization'

export const calculateDPI = props => {
  const optimization = new Optimization(props)
  const blueDpi = optimization.fnDPI(props.TDPa)
  const greenDpi = optimization.fnDPI(props.TDPv)
  return {
    blue: {
      dlp: blueDpi.DI.DLP,
      cost: blueDpi.DI.Custo,
      costMonth: blueDpi.DI.CustoMensal
    },
    green: {
      dlp: greenDpi.DI.DLP,
      cost: greenDpi.DI.Custo,
      costMonth: greenDpi.DI.CustoMensal
    }
  }
}

export const calculateDPIbyDCPi = props => {
  const optimization = new Optimization(props)
  const blueDlp = optimization.fnDPIi(props.TDPa, props.DCPi)
  const greenDlp = optimization.fnDPIi(props.TDPv, props.DCPi)
  return {
    blue: {
      dlp: blueDlp.DLP,
      cost: blueDlp.Custo,
      costMonth: blueDlp.CustoMensal
    },
    green: {
      dlp: greenDlp.DLP,
      cost: greenDlp.Custo,
      costMonth: greenDlp.CustoMensal
    }
  }
}

export const calculateDFI = props => {
  const optimization = new Optimization(props)
  const blueDfi = optimization.fnDFI(props.TDFa)
  const greenDfi = optimization.fnDFI(props.TDFv)
  return {
    blue: {
      dlf: blueDfi.DI.DLF,
      cost: blueDfi.DI.Custo,
      costMonth: blueDfi.DI.CustoMensal
    },
    green: {
      dlf: greenDfi.DI.DLF,
      cost: greenDfi.DI.Custo,
      costMonth: greenDfi.DI.CustoMensal
    }
  }
}

export const calculateDFIbyDCFi = props => {
  const optimization = new Optimization(props)
  const blueDlf = optimization.fnDFIi(props.TDFa, props.DCFi)
  const greenDlf = optimization.fnDFIi(props.TDFv, props.DCFi)
  return {
    blue: {
      dlf: blueDlf.DLF,
      cost: blueDlf.Custo,
      costMonth: blueDlf.CustoMensal
    },
    green: {
      dlf: greenDlf.DLF,
      cost: greenDlf.Custo,
      costMonth: greenDlf.CustoMensal
    }
  }
}

export default () => {}
