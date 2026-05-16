import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { payrollApi } from '../../api/payrollApi'

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
}

export const fetchPayroll = createAsyncThunk(
  'payroll/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await payrollApi.getAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll')
    }
  }
)

export const generatePayroll = createAsyncThunk(
  'payroll/generate',
  async (data, { rejectWithValue }) => {
    try {
      const response = await payrollApi.generate(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate payroll')
    }
  }
)

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayroll.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPayroll.fulfilled, (state, action) => {
        state.loading = false
        state.list = Array.isArray(action.payload)
          ? action.payload
          : action.payload.content || []
      })
      .addCase(fetchPayroll.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(generatePayroll.fulfilled, (state, action) => {
        state.list.unshift(action.payload)
      })
  },
})

export const { clearError } = payrollSlice.actions

export const selectPayroll = (state) => state.payroll.list
export const selectPayrollLoading = (state) => state.payroll.loading

export default payrollSlice.reducer
