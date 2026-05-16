import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { leaveApi } from '../../api/leaveApi'

const initialState = {
  list: [],
  myLeaves: [],
  pending: [],
  loading: false,
  error: null,
}

export const fetchLeaves = createAsyncThunk(
  'leaves/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await leaveApi.getAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaves')
    }
  }
)

export const fetchMyLeaves = createAsyncThunk(
  'leaves/fetchMy',
  async (params, { rejectWithValue }) => {
    try {
      const response = await leaveApi.getMyLeaves(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my leaves')
    }
  }
)

export const fetchPendingLeaves = createAsyncThunk(
  'leaves/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaveApi.getPending()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending leaves')
    }
  }
)

export const applyLeave = createAsyncThunk(
  'leaves/apply',
  async (data, { rejectWithValue }) => {
    try {
      const response = await leaveApi.apply(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply leave')
    }
  }
)

export const approveLeave = createAsyncThunk(
  'leaves/approve',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await leaveApi.approve(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve leave')
    }
  }
)

export const rejectLeave = createAsyncThunk(
  'leaves/reject',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await leaveApi.reject(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject leave')
    }
  }
)

const leaveSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false
        state.list = Array.isArray(action.payload)
          ? action.payload
          : action.payload.content || []
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMyLeaves.fulfilled, (state, action) => {
        state.myLeaves = Array.isArray(action.payload)
          ? action.payload
          : action.payload.content || []
      })
      .addCase(fetchPendingLeaves.fulfilled, (state, action) => {
        state.pending = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.myLeaves.unshift(action.payload)
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        state.pending = state.pending.filter((l) => l.id !== action.payload.id)
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        state.pending = state.pending.filter((l) => l.id !== action.payload.id)
      })
  },
})

export const { clearError } = leaveSlice.actions

export const selectLeaves = (state) => state.leaves.list
export const selectMyLeaves = (state) => state.leaves.myLeaves
export const selectPendingLeaves = (state) => state.leaves.pending
export const selectLeaveLoading = (state) => state.leaves.loading

export default leaveSlice.reducer
