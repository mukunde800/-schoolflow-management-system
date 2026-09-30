const { Student, User, Class } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', classId } = req.query;
    const where = {};
    if (classId) where.classId = classId;

    const { rows, count } = await Student.findAndCountAll({
      where,
      include: [
        { association: 'user', where: search ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        } : undefined },
        { association: 'class' },
      ],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });

    res.json({ data: rows, total: count, page: +page, totalPages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: ['user', 'class', 'parent', 'grades', 'attendances', 'payments'],
    });
    if (!student) return res.status(404).json({ message: 'Étudiant introuvable' });
    res.json(student);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Étudiant introuvable' });
    await student.update(req.body);
    res.json(student);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Étudiant introuvable' });
    await student.destroy();
    res.json({ message: 'Étudiant supprimé' });
  } catch (err) { next(err); }
};

exports.getGrades = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id, { include: ['grades'] });
    res.json(student?.grades || []);
  } catch (err) { next(err); }
};

exports.getAttendance = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id, { include: ['attendances'] });
    res.json(student?.attendances || []);
  } catch (err) { next(err); }
};