const { Setting } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const settings = await Setting.findAll();
    // Transforme en objet clé/valeur
    const result = settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
    res.json(result);
  } catch (err) { next(err); }
};

exports.upsert = async (req, res, next) => {
  try {
    const entries = Object.entries(req.body);
    await Promise.all(
      entries.map(([key, value]) =>
        Setting.upsert({ key, value: String(value ?? '') })
      )
    );
    res.json({ message: 'Paramètres enregistrés' });
  } catch (err) { next(err); }
};

exports.reset = async (req, res, next) => {
  try {
    await Setting.destroy({ where: {} });
    res.json({ message: 'Paramètres réinitialisés' });
  } catch (err) { next(err); }
};