
import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers

    if (!dtoken) {
      return res.status(401).json({
        success: false,
        message: 'Not Authorized. Login Again'
      })
    }

    const token_decode = jwt.verify(
      dtoken,
      process.env.JWT_SECRET
    )

    req.docId = token_decode.id

    next()

  } catch (error) {
    console.log('Doctor Authentication Error:', error.message)

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}

export default authDoctor
