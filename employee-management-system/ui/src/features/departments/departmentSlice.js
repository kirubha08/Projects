import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { departmentApi } from '../../api/departmentApi'

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
}

export const fetchDepartments = createAsyncThunk(
  'departments/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await departmentApi.getAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments')
    }
  }
)

export const createDepartment = createAsyncThunk(
  'departments/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await departmentApi.create(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create department')
    }
  }
)

export const updateDepartment = createAsyncThunk(
  'departments/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await departmentApi.update(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update department')
    }
  }
)

export const deleteDepartment = createAsyncThunk(
  'departments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await departmentApi.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete department')
    }
  }
)

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelected: (state, action) => {
      state.selected = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false
        state.list = Array.isArray(action.payload)
          ? action.payload
          : action.payload.content || []
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.list.unshift(action.payload)
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const index = state.list.findIndex((d) => d.id === action.payload.id)
        if (index !== -1) state.list[index] = action.payload
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d.id !== action.payload)
      })
  },
})

export const { clearError, setSelected } = departmentSlice.actions

export const selectDepartments = (state) => state.departments.list
export const selectDepartmentLoading = (state) => state.departments.loading

export default departmentSlice.reducer
