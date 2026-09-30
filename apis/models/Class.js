module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    level: DataTypes.STRING,
    academicYear: DataTypes.STRING,
    capacity: { type: DataTypes.INTEGER, defaultValue: 40 },
    room: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, { tableName: 'classes' });

  Class.associate = (models) => {
    Class.hasMany(models.Student, { foreignKey: 'classId', as: 'students' });
    Class.belongsToMany(models.Teacher, { through: 'ClassTeachers', foreignKey: 'classId', as: 'teachers' });
    Class.hasMany(models.Schedule, { foreignKey: 'classId', as: 'schedules' });
    Class.hasMany(models.Enrollment, { foreignKey: 'classId', as: 'enrollments' });
  };

  return Class;
};