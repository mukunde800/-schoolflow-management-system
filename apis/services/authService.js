const { User, Student, Teacher, Parent } = require('../models');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { signToken } = require('../utils/jwt');

exports.register = async (data) => {
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) throw Object.assign(new Error('Email déjà utilisé'), { status: 409 });

  const hashed = await hashPassword(data.password);
  const user = await User.create({ ...data, password: hashed });

  if (user.role === 'student') {
    await Student.create({ userId: user.id, matricule: `STU-${Date.now()}` });
  } else if (user.role === 'teacher') {
    await Teacher.create({ userId: user.id, employeeId: `TCH-${Date.now()}` });
  } else if (user.role === 'parent') {
    await Parent.create({ userId: user.id });
  }

  const token = signToken({ id: user.id, role: user.role });
  return { user, token };
};

exports.login = async (email, password) => {
  const user = await User.scope('withPassword').findOne({ where: { email } });
  if (!user) throw Object.assign(new Error('Identifiants invalides'), { status: 401 });

  const ok = await comparePassword(password, user.password);
  if (!ok) throw Object.assign(new Error('Identifiants invalides'), { status: 401 });

  await user.update({ lastLogin: new Date() });

  const token = signToken({ id: user.id, role: user.role });
  const { password: _, ...safeUser } = user.toJSON();
  return { user: safeUser, token };
};

exports.getMe = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [
      { association: 'student', include: ['class'] },
      { association: 'teacher' },
      { association: 'parentProfile' },
    ],
  });
  if (!user) throw Object.assign(new Error('Utilisateur introuvable'), { status: 404 });
  return user;
};