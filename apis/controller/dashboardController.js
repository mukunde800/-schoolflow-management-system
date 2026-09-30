const { Student, Teacher, Class, Payment, Attendance, Grade, Announcement } = require('../models');
const { Op, fn, col } = require('sequelize');

exports.getStats = async (req, res, next) => {
  try {
    const [totalStudents, totalTeachers, totalClasses] = await Promise.all([
      Student.count(), Teacher.count(), Class.count(),
    ]);

    const [paid, overdue, pending] = await Promise.all([
      Payment.sum('amount', { where: { status: 'paid' } }),
      Payment.sum('amount', { where: { status: 'overdue' } }),
      Payment.sum('amount', { where: { status: 'pending' } }),
    ]);

    const absences = await Attendance.count({ where: { status: 'absent' } });

    res.json({
      totalStudents, totalTeachers, totalClasses,
      payments: { paid: paid || 0, overdue: overdue || 0, pending: pending || 0 },
      absences,
    });
  } catch (err) { next(err); }
};

exports.getRecentActivities = async (req, res, next) => {
  try {
    const announcements = await Announcement.findAll({
      limit: 5,
      order: [['publishedAt', 'DESC']],
      include: ['author'],
    });
    res.json({ announcements });
  } catch (err) { next(err); }
};

exports.getAttendanceChart = async (req, res, next) => {
  try {
    const data = await Attendance.findAll({
      attributes: ['date', 'status', [fn('COUNT', col('id')), 'count']],
      group: ['date', 'status'],
      order: [['date', 'ASC']],
      limit: 30,
    });
    res.json(data);
  } catch (err) { next(err); }
};

exports.getGradeDistribution = async (req, res, next) => {
  try {
    const grades = await Grade.findAll({ attributes: ['value'] });
    const distribution = { '0-5': 0, '5-10': 0, '10-15': 0, '15-20': 0 };
    grades.forEach((g) => {
      const v = parseFloat(g.value);
      if (v < 5) distribution['0-5']++;
      else if (v < 10) distribution['5-10']++;
      else if (v < 15) distribution['10-15']++;
      else distribution['15-20']++;
    });
    res.json(distribution);
  } catch (err) { next(err); }
};