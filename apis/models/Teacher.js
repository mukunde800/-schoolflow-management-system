module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    employeeId: { type: DataTypes.STRING, unique: true },
    hireDate: DataTypes.DATEONLY,
    specialization: DataTypes.STRING,
    diploma: DataTypes.STRING,
    salary: DataTypes.DECIMAL(10, 2),
  }, { tableName: 'teachers' });

  Teacher.associate = (models) => {
    Teacher.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Teacher.belongsToMany(models.Subject, { through: 'TeacherSubjects', foreignKey: 'teacherId', as: 'subjects' });
    Teacher.belongsToMany(models.Class, { through: 'ClassTeachers', foreignKey: 'teacherId', as: 'classes' });
    Teacher.hasMany(models.Schedule, { foreignKey: 'teacherId', as: 'schedules' });
  };

  return Teacher;
};