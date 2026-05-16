import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { employeeApi } from '../../api/employeeApi'

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  filters: {
    department: '',
    status: '',
    search: '',
  },
}

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await employeeApi.getAll(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees')
    }
  }
)

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await employeeApi.getById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee')
    }
  }
)

export const createEmployee = createAsyncThunk(
  'employees/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await employeeApi.create(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create employee')
    }
  }
)

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await employeeApi.update(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee')
    }
  }
)

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { rejectWithValue }) => {
    try {
      await employeeApi.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee')
    }
  }
)

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearSelected: (state) => {
      state.selected = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false
        // Handle both paginated and non-paginated responses
        if (action.payload.content) {
          state.list = action.payload.content
          state.pagination = {
            page: action.payload.number || 0,
            size: action.payload.size || 10,
            totalElements: action.payload.totalElements || 0,
            totalPages: action.payload.totalPages || 0,
          }
        } else {
          state.list = Array.isArray(action.payload) ? action.payload : []
          state.pagination.totalElements = state.list.length
        }
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false
        state.selected = action.payload
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createEmployee.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false
        state.list.unshift(action.payload)
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false
        const index = state.list.findIndex((e) => e.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e.id !== action.payload)
        if (state.selected?.id === action.payload) {
          state.selected = null
        }
      })
  },
})

export const { setFilters, clearSelected, clearError } = employeeSlice.actions

export const selectEmployees = (state) => state.employees.list
export const selectSelectedEmployee = (state) => state.employees.selected
export const selectEmployeeLoading = (state) => state.employees.loading
export const selectEmployeePagination = (state) => state.employees.pagination

export default employeeSlice.reducer
