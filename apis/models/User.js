module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    phone: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('admin', 'teacher', 'student', 'parent'),
      defaultValue: 'student',
    },
    avatar: DataTypes.STRING,
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    lastLogin: DataTypes.DATE,
  }, {
    tableName: 'users',
    defaultScope: { attributes: { exclude: ['password'] } },
    scopes: { withPassword: { attributes: {} } },
  });

  User.associate = (models) => {
    User.hasOne(models.Student, { foreignKey: 'userId', as: 'student' });
    User.hasOne(models.Teacher, { foreignKey: 'userId', as: 'teacher' });
    User.hasOne(models.Parent, { foreignKey: 'userId', as: 'parentProfile' });
    User.hasMany(models.Announcement, { foreignKey: 'authorId', as: 'announcements' });
  };

  return User;
};