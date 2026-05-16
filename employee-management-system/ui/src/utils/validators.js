import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .max(15, 'Phone too long')
    .regex(/^\+?[0-9\s\-()]+$/, 'Invalid phone number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  departmentId: z.string().min(1, 'Department is required'),
  designationId: z.string().optional(),
  designation: z.string().optional(),
  employmentType: z.string().min(1, 'Employment type is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  salary: z.coerce
    .number()
    .min(0, 'Salary must be positive')
    .optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
})

export const leaveSchema = z.object({
  leaveType: z.string().min(1, 'Leave type is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z
    .string()
    .min(10, 'Please provide a reason (at least 10 characters)')
    .max(500, 'Reason too long'),
})

export const departmentSchema = z.object({
  name: z.string().min(1, 'Department name is required').max(100),
  code: z.string().min(1, 'Department code is required').max(20),
  description: z.string().optional(),
  managerId: z.string().optional(),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export const performanceSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  reviewPeriod: z.string().min(1, 'Review period is required'),
  rating: z.coerce.number().min(1).max(5),
  goals: z.string().optional(),
  achievements: z.string().optional(),
  improvements: z.string().optional(),
  comments: z.string().optional(),
})
