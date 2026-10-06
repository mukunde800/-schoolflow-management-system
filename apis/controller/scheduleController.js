const { Schedule, Class, Subject, Teacher } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const { classId, teacherId, dayOfWeek } = req.query;
    const where = {};
    if (classId) where.classId = classId;
    if (teacherId) where.teacherId = teacherId;
    if (dayOfWeek) where.dayOfWeek = dayOfWeek;

    const schedules = await Schedule.findAll({
      where,
      include: [
        { association: 'class' },
        { association: 'subject' },
        { association: 'teacher', include: ['user'] },
      ],
      order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']],
    });
    res.json(schedules);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id, {
      include: ['class', 'subject', { association: 'teacher', include: ['user'] }],
    });
    if (!schedule) return res.status(404).json({ message: 'Emploi du temps introuvable' });
    res.json(schedule);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime, room } = req.body;

    // Vérifier les conflits (même classe, même jour, même créneau)
    const conflict = await Schedule.findOne({
      where: {
        classId,
        dayOfWeek,
        startTime: { [require('sequelize').Op.lt]: endTime },
        endTime: { [require('sequelize').Op.gt]: startTime },
      },
    });

    if (conflict) {
      return res.status(409).json({
        message: 'Conflit d\'emploi du temps pour cette classe sur ce créneau',
      });
    }

    const schedule = await Schedule.create(req.body);
    res.status(201).json(schedule);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Emploi du temps introuvable' });
    await schedule.update(req.body);
    res.json(schedule);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Emploi du temps introuvable' });
    await schedule.destroy();
    res.json({ message: 'Emploi du temps supprimé' });
  } catch (err) { next(err); }
};