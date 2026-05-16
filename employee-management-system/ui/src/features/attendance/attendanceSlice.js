import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { attendanceApi } from '../../api/attendanceApi'

const initialState = {
  list: [],
  monthly: [],
  today: null,
  loading: false,
  error: null,
}

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance')
    }
  }
)

export const fetchMonthlyAttendance = createAsyncThunk(
  'attendance/fetchMonthly',
  async (params, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getMonthly(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch monthly attendance')
    }
  }
)

export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (data, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.checkIn(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check-in failed')
    }
  }
)

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.list = Array.isArray(action.payload)
          ? action.payload
          : action.payload.content || []
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMonthlyAttendance.fulfilled, (state, action) => {
        state.monthly = action.payload
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.today = action.payload
      })
  },
})

export const { clearError } = attendanceSlice.actions

export const selectAttendance = (state) => state.attendance.list
export const selectAttendanceLoading = (state) => state.attendance.loading

export default attendanceSlice.reducer
