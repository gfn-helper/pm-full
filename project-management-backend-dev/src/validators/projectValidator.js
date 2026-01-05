import * as yup from 'yup';

const projectCreateValidator = yup.object().shape({
  name: yup.string().required('Name is required').trim(),
  projectType: yup
    .string()
    .oneOf(['kanban', 'scrum'], 'Invalid project type')
    .required('Type is required'),
  columns: yup
    .array()
    .of(yup.string().trim())
    .default(['todo', 'in-progress', 'done']),
  members: yup.array().of(yup.string().trim()).default([]),
  memberLead: yup.string().trim(),
});

const projectUpdateValidator = yup.object().shape({
  projectType: yup
    .string()
    .oneOf(['kanban', 'scrum', 'bug-tracker'], 'Invalid project type'),
  columns: yup.array().of(yup.string().trim()),
  members: yup.array().of(yup.string().trim()),
});

export { projectCreateValidator, projectUpdateValidator };
