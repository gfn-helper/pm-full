import * as yup from 'yup';

const sprintCreateValidator = yup.object({
  tasks: yup.array().of(yup.string().trim()).default([]),
  dueDate: yup.date(),
  projectId: yup.string().trim().required(),
  storyPoint: yup.number().typeError('Story point must be a number'),
});

const sprintUpdateValidator = yup.object({
  tasks: yup.array().of(yup.string().trim()),
  dueDate: yup.date(),
  isCompleted: yup.boolean(),
  storyPoint: yup.number().typeError('Story point must be a number'),
});

export { sprintCreateValidator, sprintUpdateValidator };
