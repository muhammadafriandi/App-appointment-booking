// import jwt from 'jsonwebtoken'


// // admin authentication middleware
// const authAdmin = async (req, res, next) => {
//   try {

//     const { aToken } = req.headers
//     if (!aToken) {
//       return res.status(401).json({ success: false, message: "Not authorized. Please log in again." })
//     }

//     const decoded = jwt.verify(aToken, process.env.JWT_SECRET)

//     if (decoded.email !== process.env.ADMIN_EMAIL) {
//       return res.status(403).json({ success: false, message: "Access denied" })
//     }

//     next()

//   } catch (error) {
//     console.log(error)
//     res.status(400).json({ success: false, message: 'Invalid or expired token' })
//   }
// }


// export default authAdmin
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
