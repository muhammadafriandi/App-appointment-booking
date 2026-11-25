import { useCallback, useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [dToken, setDToken] = useState(() => localStorage.getItem('dToken') || '')
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)

  const getAppointments = useCallback(async () => {

    if (!dToken) {
      toast.error('Please login first')
      return
    }

    try {

      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { dToken: dToken }
      }
      )

      if (data.success) {
        setAppointments(data.appointments)
        // setAppointments(data.appointments.reserve())
        console.log('appointment reverse', data.appointments)
      } else {
        toast.error(data.message)
      }

    } catch (error) {

      console.error('Get Appointments Error:', error.response?.data || error.message)

      if (error.response?.status === 401) {
        // logoutDoctor();
        toast.error('Session expired. Please login again.')
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch appointments')
      }

    }

  }, [backendUrl, dToken])


  const saveToken = (token) => {
    setDToken(token);
    localStorage.setItem("dToken", token);
  }

  const completeAppointment = async (appointmentId) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } })

      if (data.success) {
        toast.success(data.message)
        getAppointments()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { docId } })

      if (data.success) {
        toast.success(data.message)
        getAppointments()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const getDashData = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } })
      if (data.success) {
        setDashData(data.dashData)
        console.log(data.dashData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const value = {
    dToken, setDToken,
    appointments, setAppointments,
    completeAppointment, cancelAppointment,
    dashData, setDashData, getDashData,
    backendUrl, getAppointments, saveToken
  }

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider
