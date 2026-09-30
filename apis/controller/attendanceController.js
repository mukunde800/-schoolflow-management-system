const { Attendance, Student } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res, next) => {
  try {
    const { studentId, classId, date, startDate, endDate } = req.query;
    const where = {};
    if (studentId) where.studentId = studentId;
    if (classId) where.classId = classId;
    if (date) where.date = date;
    if (startDate && endDate) where.date = { [Op.between]: [startDate, endDate] };

    const attendances = await Attendance.findAll({
      where,
      include: [{ association: 'student', include: ['user'] }],
      order: [['date', 'DESC']],
    });
    res.json(attendances);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json(attendance);
  } catch (err) { next(err); }
};

exports.bulkMark = async (req, res, next) => {
  try {
    const { attendances } = req.body;
    const result = await Attendance.bulkCreate(attendances, {
      updateOnDuplicate: ['status', 'justification'],
    });
    res.status(201).json(result);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const att = await Attendance.findByPk(req.params.id);
    if (!att) return res.status(404).json({ message: 'Présence introuvable' });
    await att.update(req.body);
    res.json(att);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const att = await Attendance.findByPk(req.params.id);
    if (!att) return res.status(404).json({ message: 'Présence introuvable' });
    await att.destroy();
    res.json({ message: 'Présence supprimée' });
  } catch (err) { next(err); }
};