module.exports = (sequelize, DataTypes) => {
  const Parent = sequelize.define('Parent', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    profession: DataTypes.STRING,
    address: DataTypes.STRING,
    relationship: DataTypes.ENUM('father', 'mother', 'guardian'),
  }, { tableName: 'parents' });

  Parent.associate = (models) => {
    Parent.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Parent.hasMany(models.Student, { foreignKey: 'parentId', as: 'children' });
  };

  return Parent;
};