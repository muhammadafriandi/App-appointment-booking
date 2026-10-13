import doctorModel from '../models/doctorModel.js'


const changeAvaibility = async (req, res) => {
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


export { changeAvaibility, doctorList }
