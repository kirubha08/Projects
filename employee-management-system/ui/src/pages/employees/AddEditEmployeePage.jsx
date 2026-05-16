import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'
import toast from 'react-hot-toast'
import {
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  selectSelectedEmployee,
  selectEmployeeLoading,
} from '../../features/employees/employeeSlice'
import { fetchDepartments, selectDepartments } from '../../features/departments/departmentSlice'
import { employeeSchema } from '../../utils/validators'
import { GENDER_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from '../../utils/constants'
import Input, { Select, Textarea } from '../../components/common/Input'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const STEPS = [
  { id: 1, title: 'Personal Info', fields: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender'] },
  { id: 2, title: 'Employment', fields: ['departmentId', 'designation', 'employmentType', 'joiningDate', 'salary'] },
  { id: 3, title: 'Contact & Other', fields: ['address', 'city', 'state', 'pincode', 'emergencyContact', 'emergencyPhone'] },
]

const AddEditEmployeePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isEdit = !!id

  const employee = useSelector(selectSelectedEmployee)
  const loading = useSelector(selectEmployeeLoading)
  const departments = useSelector(selectDepartments)

  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
  })

  useEffect(() => {
    dispatch(fetchDepartments())
    if (isEdit) {
      dispatch(fetchEmployeeById(id))
    }
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (isEdit && employee) {
      reset({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
        gender: employee.gender || '',
        departmentId:  '',
        designation: employee.designation || '',
        employmentType: employee.employmentType || '',
        joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : '',
        salary: employee.salary || '',
        address: employee.address || '',
        city: employee.city || '',
        state: employee.state || '',
        pincode: employee.pincode || '',
        emergencyContact: employee.emergencyContact || '',
        emergencyPhone: employee.emergencyPhone || '',
      })
    }git config --global user.name "Kirubha"
git config --global user.email "kirubha@gmail.com"
  }, [employee, isEdit, reset])

  const handleNext = async () => {
    const currentFields = STEPS[step - 1].fields
    const valid = await trigger(currentFields)
    if (valid) setStep((s) => s + 1)
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      let result
      if (isEdit) {
        result = await dispatch(updateEmployee({ id, data }))
        if (updateEmployee.fulfilled.match(result)) {
          toast.success('Employee updated successfully!')
          navigate(`/employees/${id}`)
        } else {
          toast.error(result.payload || 'Update failed')
        }
      } else {
        result = await dispatch(createEmployee(data))
        if (createEmployee.fulfilled.match(result)) {
          toast.success('Employee created successfully!')
          navigate('/employees')
        } else {
          toast.error(result.payload || 'Creation failed')
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && isEdit && !employee) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="xl" text="Loading employee..." />
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(isEdit ? `/employees/${id}` : '/employees')}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <FaArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h1>
          <p className="text-sm text-gray-500">Step {step} of {STEPS.length}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0 transition-colors ${
                step > s.id
                  ? 'bg-green-500 text-white'
                  : step === s.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step > s.id ? <FaCheck className="h-3 w-3" /> : s.id}
            </div>
            <span className={`text-sm font-medium ${step === s.id ? 'text-indigo-600' : 'text-gray-400'}`}>
              {s.title}
            </span>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="section-title mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  error={errors.firstName?.message}
                  required
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  required
                  {...register('lastName')}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@company.com"
                  error={errors.email?.message}
                  required
                  {...register('email')}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 9876543210"
                  error={errors.phone?.message}
                  required
                  {...register('phone')}
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  error={errors.dateOfBirth?.message}
                  required
                  {...register('dateOfBirth')}
                />
                <Select
                  label="Gender"
                  error={errors.gender?.message}
                  required
                  {...register('gender')}
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Employment */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="section-title mb-4">Employment Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Department"
                  error={errors.departmentId?.message}
                  required
                  {...register('departmentId')}
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={String(d.id)}>{d.name}</option>
                  ))}
                </Select>
                <Input
                  label="Designation"
                  placeholder="Software Engineer"
                  error={errors.designation?.message}
                  {...register('designation')}
                />
                <Select
                  label="Employment Type"
                  error={errors.employmentType?.message}
                  required
                  {...register('employmentType')}
                >
                  <option value="">Select type</option>
                  {EMPLOYMENT_TYPE_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </Select>
                <Input
                  label="Joining Date"
                  type="date"
                  error={errors.joiningDate?.message}
                  required
                  {...register('joiningDate')}
                />
                <Input
                  label="Salary (Monthly)"
                  type="number"
                  placeholder="50000"
                  error={errors.salary?.message}
                  {...register('salary')}
                />
              </div>
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="section-title mb-4">Contact & Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Textarea
                  label="Address"
                  placeholder="Street address"
                  containerClassName="sm:col-span-2"
                  {...register('address')}
                />
                <Input
                  label="City"
                  placeholder="Mumbai"
                  {...register('city')}
                />
                <Input
                  label="State"
                  placeholder="Maharashtra"
                  {...register('state')}
                />
                <Input
                  label="PIN Code"
                  placeholder="400001"
                  {...register('pincode')}
                />
                <div className="sm:col-span-2 border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Emergency Contact</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Contact Name"
                      placeholder="Jane Doe"
                      {...register('emergencyContact')}
                    />
                    <Input
                      label="Contact Phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      {...register('emergencyPhone')}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              icon={FaArrowLeft}
              onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/employees')}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>

            {step < STEPS.length ? (
              <Button
                type="button"
                variant="primary"
                icon={FaArrowRight}
                iconPosition="right"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                icon={FaCheck}
              >
                {isEdit ? 'Save Changes' : 'Create Employee'}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}

export default AddEditEmployeePage
