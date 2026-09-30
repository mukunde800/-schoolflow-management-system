module.exports = (sequelize, DataTypes) => {
  const Announcement = sequelize.define('Announcement', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    authorId: { type: DataTypes.UUID, allowNull: false },
    targetRole: { type: DataTypes.ENUM('all', 'admin', 'teacher', 'student', 'parent'), defaultValue: 'all' },
    classId: DataTypes.UUID,
    publishedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    expiresAt: DataTypes.DATE,
    priority: { type: DataTypes.ENUM('low', 'normal', 'high'), defaultValue: 'normal' },
  }, { tableName: 'announcements' });

  Announcement.associate = (models) => {
    Announcement.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    Announcement.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
  };

  return Announcement;
};