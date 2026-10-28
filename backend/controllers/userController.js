import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'


// API to register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing Details" })
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong Password" })
    }

    // hashing password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name,
      email,
      password: hashedPassword,
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.json({ success: true, token })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


// API for user login
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body
    // const { user } = await userModel.findOne({ email })
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(400).json({ success: false, message: 'User does not exists' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: "Invalid credintials" })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


// API to get user profile data
const getProfile = async (req, res) => {
  try {

    const userId = req.userId
    const userData = await userModel.findById(userId).select('-password')

    res.status(200).json({ success: true, userData })

  } catch (error) {
    console.log(error)
    res.status(400).json({ succcess: false, message: error.message })
  }
}


// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId
    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized user'
      })
    }

    if (!name || !phone || !dob || !gender || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing required profile details'
      })
    }

    // Parse the address safely
    let parsedAddress

    try {
      parsedAddress = JSON.parse(address)
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid address format'
      })
    }

    const updateData = {
      name,
      phone,
      dob,
      gender,
      address: parsedAddress
    }

    // Upload the image if a new one was provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(
        imageFile.path,
        { resource_type: 'image' }
      )

      updateData.image = imageUpload.secure_url
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Profile Updated',
      userData: updatedUser
    })

  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    })
  }
}

// API to book appointment
const bookAppointment = async (req, res) => {
  try {

    const userId = req.userId
    const { docId, slotDate, slotTime } = req.body

    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not Available' })
    }

    let slots_booked = docData.slots_booked

    // Checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot not available' })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')

    delete docData.slots_booked

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    // save new slot data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: 'Appointment Booked' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


// API to get user appointments for frontend my-appointments page\
const listAppointment = async (req, res) => {
  try {

    const { userId } = req.userId
    const appointments = await appointmentModel.find(userId)

    res.json({ success: true, appointments })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {

    const userId = req.userId
    const { appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res.status(401).json({ success: false, message: "Unauthorized action" })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    // relasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData

    const doctorData = await doctorModel.findById(docId)

    let slots_booked = doctorData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: 'Appointment Cancelled' })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}


// API to make payment of appointment using razorpay
const paymentRazorPay = async (req, res) => {

}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment }
