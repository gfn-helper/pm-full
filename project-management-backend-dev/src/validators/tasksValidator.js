import * as yup from 'yup';

export const tasksCreateValidator = yup.object().shape({
  projectId: yup.string().trim().required(),
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .max(100, 'Title must be under 100 characters'),
  description: yup.string().trim().max(1000, 'Description too long'),
  type: yup
    .string()
    .oneOf(['bug', 'feature', 'task', 'story'], 'Invalid type')
    .required('Type is required'),
  status: yup.string().required(),
  priority: yup
    .string()
    .oneOf(['low', 'medium', 'high', 'critical'])
    .default('medium'),
  tags: yup.array().default([]),
  blocks: yup.array().of(yup.string().trim()).default([]),
  blockedBy: yup.array().of(yup.string().trim()).default([]),
  relatesTo: yup.array().of(yup.string().trim()).default([]),
  dueDate: yup.date().nullable().typeError('Invalid date format'),
  assignee: yup.string().trim().nullable(),
  storyPoint: yup.number().typeError('Story point must be a number'),
  subTask: yup.array().of(yup.string().trim()).default([]),
  parentTask: yup.string().trim().nullable(),
});

export const tasksUpdateValidator = yup.object().shape({
  title: yup.string().trim().max(100, 'Title must be under 100 characters'),
  description: yup.string().trim().max(1000, 'Description too long'),
  type: yup.string().oneOf(['bug', 'story', 'task'], 'Invalid type'),
  status: yup.string().trim(),
  priority: yup.string().oneOf(['low', 'medium', 'high', 'critical']),
  tags: yup.array().of(yup.string().trim()),
  blocks: yup.array().of(yup.string().trim()),
  blockedBy: yup.array().of(yup.string().trim()),
  relatesTo: yup.array().of(yup.string().trim()),
  dueDate: yup.date().nullable().typeError('Invalid date format'),
  assignee: yup.string().trim().nullable(),
  storyPoint: yup.number().typeError('Story point must be a number'),
  subTasks: yup.array().of(yup.string().trim().default([])),
});
