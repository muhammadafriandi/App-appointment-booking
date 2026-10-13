import jwt from 'jsonwebtoken'

const adminAuth = (req, res, next) => {
  try {
    const { atoken } = req.headers

    if (!atoken) {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized. Login Again'
      })
    }

    const decoded = jwt.verify(
      atoken,
      process.env.JWT_SECRET
    )

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized'
      })
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}

export default adminAuth
