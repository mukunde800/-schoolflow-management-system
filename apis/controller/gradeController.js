const { Grade, Student, Subject } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const { studentId, subjectId, semester } = req.query;
    const where = {};
    if (studentId) where.studentId = studentId;
    if (subjectId) where.subjectId = subjectId;
    if (semester) where.semester = semester;

    const grades = await Grade.findAll({
      where,
      include: [
        { association: 'student', include: ['user'] },
        { association: 'subject' },
      ],
      order: [['date', 'DESC']],
    });
    res.json(grades);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const grade = await Grade.create({ ...req.body, teacherId: req.user.teacher?.id });
    res.status(201).json(grade);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const grade = await Grade.findByPk(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Note introuvable' });
    await grade.update(req.body);
    res.json(grade);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const grade = await Grade.findByPk(req.params.id);
    if (!grade) return res.status(404).json({ message: 'Note introuvable' });
    await grade.destroy();
    res.json({ message: 'Note supprimée' });
  } catch (err) { next(err); }
};

exports.bulkCreate = async (req, res, next) => {
  try {
    const grades = await Grade.bulkCreate(req.body.grades);
    res.status(201).json(grades);
  } catch (err) { next(err); }
};