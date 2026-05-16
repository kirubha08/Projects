import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaBuilding, FaPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  selectDepartments,
  selectDepartmentLoading,
} from '../../features/departments/departmentSlice'
import { departmentSchema } from '../../utils/validators'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input, { Textarea } from '../../components/common/Input'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import SearchBar from '../../components/common/SearchBar'

const DepartmentPage = () => {
  const dispatch = useDispatch()
  const { canManageDepartments } = useAuth()

  const departments = useSelector(selectDepartments)
  const loading = useSelector(selectDepartmentLoading)

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(departmentSchema) })

  useEffect(() => {
    dispatch(fetchDepartments())
  }, [dispatch])

  const openAdd = () => {
    setEditTarget(null)
    reset({ name: '', code: '', description: '' })
    setModalOpen(true)
  }

  const openEdit = (dept) => {
    setEditTarget(dept)
    reset({ name: dept.name, code: dept.code, description: dept.description || '' })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    let result
    if (editTarget) {
      result = await dispatch(updateDepartment({ id: editTarget.id, data }))
      if (updateDepartment.fulfilled.match(result)) {
        toast.success('Department updated')
      } else {
        toast.error(result.payload || 'Update failed')
        return
      }
    } else {
      result = await dispatch(createDepartment(data))
      if (createDepartment.fulfilled.match(result)) {
        toast.success('Department created')
      } else {
        toast.error(result.payload || 'Creation failed')
        return
      }
    }
    setModalOpen(false)
    reset()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const result = await dispatch(deleteDepartment(deleteTarget.id))
    if (deleteDepartment.fulfilled.match(result)) {
      toast.success('Department deleted')
    } else {
      toast.error(result.payload || 'Delete failed')
    }
    setDeleteLoading(false)
    setDeleteTarget(null)
  }

  const filtered = departments.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.code?.toLowerCase().includes(search.toLowerCase())
  )

  const DEPT_COLORS = [
    'bg-indigo-50 border-indigo-200 text-indigo-700',
    'bg-green-50 border-green-200 text-green-700',
    'bg-yellow-50 border-yellow-200 text-yellow-700',
    'bg-red-50 border-red-200 text-red-700',
    'bg-purple-50 border-purple-200 text-purple-700',
    'bg-blue-50 border-blue-200 text-blue-700',
    'bg-pink-50 border-pink-200 text-pink-700',
    'bg-orange-50 border-orange-200 text-orange-700',
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="text-sm text-gray-500 mt-1">{departments.length} departments</p>
        </div>
        {canManageDepartments && (
          <Button variant="primary" icon={FaPlus} onClick={openAdd}>
            Add Department
          </Button>
        )}
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search departments..."
        className="max-w-sm"
      />

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="xl" text="Loading departments..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FaBuilding className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No departments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((dept, idx) => {
            const colorClass = DEPT_COLORS[idx % DEPT_COLORS.length]
            return (
              <div
                key={dept.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${colorClass}`}>
                    <FaBuilding className="h-5 w-5" />
                  </div>
                  {canManageDepartments && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(dept)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(dept)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                <p className="text-xs font-mono text-gray-400 mt-0.5">{dept.code}</p>
                {dept.description && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{dept.description}</p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <FaUsers className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {dept.employeeCount ?? 0} employees
                  </span>
                </div>
                {dept.managerName && (
                  <p className="text-xs text-gray-400 mt-1">
                    Manager: <span className="font-medium">{dept.managerName}</span>
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Department' : 'Add Department'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)}>
              {editTarget ? 'Save Changes' : 'Create'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <Input
            label="Department Name"
            placeholder="e.g. Engineering"
            error={errors.name?.message}
            required
            {...register('name')}
          />
          <Input
            label="Department Code"
            placeholder="e.g. ENG"
            error={errors.code?.message}
            required
            {...register('code')}
          />
          <Textarea
            label="Description"
            placeholder="Brief description of the department..."
            rows={3}
            {...register('description')}
          />
        </form>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Department"
        message={`Delete "${deleteTarget?.name}"? This may affect employees assigned to this department.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

export default DepartmentPage
