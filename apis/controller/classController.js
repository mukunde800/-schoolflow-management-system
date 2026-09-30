const { Class, Student, Teacher } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const classes = await Class.findAll({
      include: [
        { association: 'students', attributes: ['id'] },
        { association: 'teachers', include: ['user'] },
      ],
      order: [['name', 'ASC']],
    });
    res.json(classes);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const cls = await Class.findByPk(req.params.id, {
      include: ['students', 'teachers', 'schedules'],
    });
    if (!cls) return res.status(404).json({ message: 'Classe introuvable' });
    res.json(cls);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const cls = await Class.create(req.body);
    res.status(201).json(cls);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const cls = await Class.findByPk(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Classe introuvable' });
    await cls.update(req.body);
    res.json(cls);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const cls = await Class.findByPk(req.params.id);
    if (!cls) return res.status(404).json({ message: 'Classe introuvable' });
    await cls.destroy();
    res.json({ message: 'Classe supprimée' });
  } catch (err) { next(err); }
};