import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Tasks from '../models/Tasks.js';
import connectDB from './db.js';

await connectDB();

const user = [
  {
    name: 'User 1',
    email: 'test1@test.com',
    password: await bcrypt.hash('123456', 10),
    verified: true,
  },
  {
    name: 'User 2',
    email: 'test2@test.com',
    password: await bcrypt.hash('123456', 10),
    verified: true,
  },
];

const projects = [
  {
    name: 'Project 1',
    projectType: 'scrum',
    columns: ['todo', 'in-progress', 'done'],
    memberLead: '6909fa3687f03877367010d0',
    tasks: '690881df2449d985dede9b20',
  },
  {
    name: 'Project 2',
    projectType: 'scrum',
    columns: ['todo', 'in-progress', 'done'],
    memberLead: '6909fa3687f03877367010d0',
    tasks: '690881df2449d985dede9b20',
  },
];

const tasks = [
  {
    title: 'Task 1',
    description: 'login page create,backend integration',
    type: 'bug',
    key: 'PM-212',
    status: 'done',
    priority: 'high',
    dueDate: '7-11-2025',
    tags: ['a', 'b'],
  },
  {
    title: 'Task 2',
    description: 'login page create,backend integration',
    type: 'bug',
    key: 'PM-213',
    status: 'done',
    priority: 'high',
    dueDate: '7-11-2025',
    tags: ['a', 'b'],
  },
];

await User.collection.deleteMany();
await Project.collection.deleteMany();
await Tasks.collection.deleteMany();

user.forEach(async (user) => {
  const newUser = new User(user);
  await newUser.save();
  console.log('user created');

  projects.forEach(async (project) => {
    const newProject = new Project({
      ...project,
      members: [{ user: newUser._id, role: 'admin' }],
      memberLead: newUser._id,
    });
    await newProject.save();
    console.log('project created');

    tasks.forEach(async (task) => {
      const newTask = new Tasks({
        ...task,
        projectId: newProject._id,
        reporter: newUser._id,
        assignee: newUser._id,
      });
      await newTask.save();
      console.log('task created');
    });
  });
});
