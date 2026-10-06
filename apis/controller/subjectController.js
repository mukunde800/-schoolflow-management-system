const { Subject, Teacher } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const subjects = await Subject.findAll({
      include: [{ association: 'teachers', include: ['user'] }],
      order: [['name', 'ASC']],
    });
    res.json(subjects);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(req.params.id, {
      include: ['teachers'],
    });
    if (!subject) return res.status(404).json({ message: 'Matière introuvable' });
    res.json(subject);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Matière introuvable' });
    await subject.update(req.body);
    res.json(subject);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Matière introuvable' });
    await subject.destroy();
    res.json({ message: 'Matière supprimée' });
  } catch (err) { next(err); }
};