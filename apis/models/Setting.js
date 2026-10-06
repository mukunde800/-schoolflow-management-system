module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    key: { type: DataTypes.STRING, unique: true, allowNull: false },
    value: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.STRING, defaultValue: 'general' },
    description: DataTypes.STRING,
  }, { tableName: 'settings' });

  return Setting;
};