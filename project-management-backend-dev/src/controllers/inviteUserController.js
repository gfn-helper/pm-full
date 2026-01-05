import jwt from 'jsonwebtoken';
import { sendInvitationMail } from '../services/sendVerificationMail.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { config } from '../config/config.js';

export const inviteUsers = async (req, res, next) => {
  try {
    console.log(req);
    const email = req.body.email;
    const projectId = req.body.projectId;

    const project = await Project.findById(projectId);
    const user = await User.findOne({ email });

    if (user) {
      const userAlreadyInProject = await Project.findOne({
        _id: project._id,
        'members.user': user._id,
      });

      if (userAlreadyInProject) {
        throw new Error('User already exists in this project');
      }
    }
    const token = jwt.sign({ email, projectId }, config.INVITE_USER_TOKEN_KEY, {
      expiresIn: config.INVITE_USER_TOKEN_EXPIRATION_TIME,
    });

    await sendInvitationMail(email, token);

    return res.status(200).json({
      success: true,
      message: 'Invite email sent successfully',
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

export const acceptUsersInvite = async (req, res, _next) => {
  console.log(req.query);
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    const decodedInvite = jwt.verify(token, config.INVITE_USER_TOKEN_KEY);
    const { email: inviteEmail, projectId } = decodedInvite;

    const loggedInEmail = req.user.email;
    const loggedInUserId = req.user._id;

    console.log({ loggedInEmail, loggedInUserId });

    if (loggedInEmail !== inviteEmail) {
      return res.status(403).json({
        message: 'You must log in using the invited email address',
      });
    }

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const memberExists = project.members.some(
      (m) => String(m.user) === String(user._id)
    );

    if (!memberExists) {
      project.members.push({
        user: user._id,
        role: 'member',
      });
      await project.save();
    }

    return res.json({
      success: true,
      message: 'Invite accepted and user added to the project',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Invalid or expired invite token',
    });
  }
};
