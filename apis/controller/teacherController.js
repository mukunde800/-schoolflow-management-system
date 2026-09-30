const { Teacher, User } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const { rows, count } = await Teacher.findAndCountAll({
      include: [{
        association: 'user',
        where: search ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
          ],
        } : undefined,
      }],
      limit: +limit, offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
    res.json({ data: rows, total: count, page: +page, totalPages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id, { include: ['user', 'subjects', 'classes'] });
    if (!teacher) return res.status(404).json({ message: 'Enseignant introuvable' });
    res.json(teacher);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json(teacher);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Enseignant introuvable' });
    await teacher.update(req.body);
    res.json(teacher);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Enseignant introuvable' });
    await teacher.destroy();
    res.json({ message: 'Enseignant supprimé' });
  } catch (err) { next(err); }
};