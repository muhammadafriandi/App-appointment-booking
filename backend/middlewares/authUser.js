import jwt from 'jsonwebtoken'


// user authentication middleware
const authUser = (req, res, next) => {
  try {

    const { token } = req.headers

    if (!token) {
      return res.status(403).json({ success: false, message: "Not AUthorized login again" })
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = token_decode.id

    next()

  } catch (error) {
    console.log(error)
    return res.status(401).json({ success: false, message: error.message })
  }
}

export default authUser
