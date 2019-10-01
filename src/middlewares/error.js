export default (err, req, res, next) => {
  const { message = 'Unknown error' } = err
  if (res.statusCode === 200) res.status(500)
  return res.send({ message })
}
