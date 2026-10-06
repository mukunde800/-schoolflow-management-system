const { Announcement, User, Class } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res, next) => {
  try {
    const { targetRole, priority, classId } = req.query;
    const where = {};
    if (targetRole) where.targetRole = targetRole;
    if (priority) where.priority = priority;
    if (classId) where.classId = classId;

    const announcements = await Announcement.findAll({
      where,
      include: [
        { association: 'author', attributes: ['id', 'firstName', 'lastName', 'role'] },
        { association: 'class', attributes: ['id', 'name'] },
      ],
      order: [['publishedAt', 'DESC']],
    });

    res.json(announcements);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id, {
      include: ['author', 'class'],
    });
    if (!announcement) return res.status(404).json({ message: 'Annonce introuvable' });
    res.json(announcement);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      authorId: req.user.id,
    });
    res.status(201).json(announcement);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Annonce introuvable' });
    await announcement.update(req.body);
    res.json(announcement);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByPk(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Annonce introuvable' });
    await announcement.destroy();
    res.json({ message: 'Annonce supprimée' });
  } catch (err) { next(err); }
};