import doctorModel from '../models/doctorModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body

    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })

    res.status(200).json({ success: true, message: 'Available Change' })

  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message })
  }
}


const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])

    res.json({ success: true, doctors })

  } catch (error) {
    console.log(error.message)
    res.status(400).json({ success: false, message: error.message })
  }
}

// API for doctor login
const loginDoctor = async (req, res) => {
  try {

    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })

    if (!doctor) {
      return res.json({ success: false, message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, doctor.password)

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
      res.status(200).json({ success: true, token })

    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


export { changeAvailability, doctorList, loginDoctor }
