const { Payment, Student } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res, next) => {
  try {
    const { studentId, status, type } = req.query;
    const where = {};
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;
    if (type) where.type = type;

    const payments = await Payment.findAll({
      where,
      include: [{ association: 'student', include: ['user'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(payments);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Paiement introuvable' });
    await payment.update(req.body);
    res.json(payment);
  } catch (err) { next(err); }
};

exports.markAsPaid = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Paiement introuvable' });
    await payment.update({ status: 'paid', paidDate: new Date() });
    res.json(payment);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Paiement introuvable' });
    await payment.destroy();
    res.json({ message: 'Paiement supprimé' });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const total = await Payment.sum('amount', { where: { status: 'paid' } });
    const pending = await Payment.sum('amount', { where: { status: 'pending' } });
    const overdue = await Payment.sum('amount', { where: { status: 'overdue' } });
    res.json({ total, pending, overdue });
  } catch (err) { next(err); }
};