import io from 'socket.io'

const randNumber = () => parseInt(Math.random(10) * 100, 10)

export default http => {
  const ws = io(http)

  ws.on('connection', socket => {
    console.log('Ws connection from', socket.id)
  })
  /** Chart emitters */
  Array(4).fill(0).map((n, i) => i + 1).forEach(i => {
    const interval = (150 * i) * i
    console.log('Chart', i, 'with Interval', interval + 'ms')
    setInterval(() => {
      ws.emit('chart:' + i, randNumber())
    }, interval)
  })
  /** Panel emitters */
  Array(4).fill(0).map((n, i) => i + 1).forEach(i => {
    const interval = (250 * i) * i
    console.log('Panel', i, 'with Interval', interval + 'ms')
    let x = 0
    setInterval(() => {
      x += randNumber() * 1.3
      ws.emit('panel:' + i, x)
    }, interval)
  })

  return ws
}
