const { User, Student, Teacher, Parent } = require('../models');
const { hashPassword, comparePassword } = require('../utils/bcrypt');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { association: 'student', include: ['class'] },
        { association: 'teacher' },
        { association: 'parentProfile' },
      ],
    });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(user);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    await user.update({
      firstName: firstName ?? user.firstName,
      lastName: lastName ?? user.lastName,
      phone: phone ?? user.phone,
      avatar: avatar ?? user.avatar,
    });

    const { password, ...safeUser } = user.toJSON();
    res.json(safeUser);
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    const user = await User.scope('withPassword').findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const ok = await comparePassword(currentPassword, user.password);
    if (!ok) return res.status(401).json({ message: 'Mot de passe actuel incorrect' });

    await user.update({ password: await hashPassword(newPassword) });
    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: ['student', 'teacher', 'parentProfile'],
    });

    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    let stats = {};

    if (user.role === 'student' && user.student) {
      const { Grade, Attendance, Payment } = require('../models');
      const grades = await Grade.findAll({ where: { studentId: user.student.id } });
      const attendances = await Attendance.findAll({ where: { studentId: user.student.id } });
      const payments = await Payment.findAll({ where: { studentId: user.student.id } });

      const avg = grades.length
        ? (grades.reduce((s, g) => s + parseFloat(g.value), 0) / grades.length).toFixed(2)
        : 0;

      stats = {
        grades: grades.length,
        average: avg,
        absences: attendances.filter((a) => a.status === 'absent').length,
        payments: payments.length,
        totalPaid: payments.filter((p) => p.status === 'paid').reduce((s, p) => s + parseFloat(p.amount), 0),
      };
    } else if (user.role === 'teacher' && user.teacher) {
      const { Class, Subject, Grade } = require('../models');
      const classes = await Class.findAll({ include: [{ association: 'teachers', where: { id: user.teacher.id }, required: false }] });
      const subjects = await Subject.findAll({ include: [{ association: 'teachers', where: { id: user.teacher.id }, required: false }] });
      const grades = await Grade.findAll({ where: { teacherId: user.teacher.id } });

      stats = {
        classes: classes.length,
        subjects: subjects.length,
        gradesGiven: grades.length,
      };
    } else if (user.role === 'parent' && user.parentProfile) {
      const { Student } = require('../models');
      const children = await Student.findAll({ where: { parentId: user.parentProfile.id } });
      stats = { children: children.length };
    } else if (user.role === 'admin') {
      const { Student, Teacher, Class } = require('../models');
      const [students, teachers, classes] = await Promise.all([
        Student.count(),
        Teacher.count(),
        Class.count(),
      ]);
      stats = { students, teachers, classes };
    }

    res.json(stats);
  } catch (err) { next(err); }
};

exports.deactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    await user.update({ isActive: false });
    res.json({ message: 'Compte désactivé' });
  } catch (err) { next(err); }
};