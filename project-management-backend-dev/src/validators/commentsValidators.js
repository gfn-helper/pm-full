import * as yup from 'yup';

export const commentsCreateSchema = yup.object().shape({
  taskId: yup.string().required('taskId is required'),

  message: yup
    .string()
    .trim()
    .min(1, 'Message must be at least 1 character long')
    .required('Message is required'),
});

export const commentUpdateSchema = yup.object().shape({
  message: yup
    .string()
    .trim()
    .min(1, 'Message must be at least 1 character long')
    .required('Message is required'),
});
