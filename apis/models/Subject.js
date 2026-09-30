module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, unique: true },
    coefficient: { type: DataTypes.INTEGER, defaultValue: 1 },
    description: DataTypes.TEXT,
  }, { tableName: 'subjects' });

  Subject.associate = (models) => {
    Subject.belongsToMany(models.Teacher, { through: 'TeacherSubjects', foreignKey: 'subjectId', as: 'teachers' });
    Subject.hasMany(models.Grade, { foreignKey: 'subjectId', as: 'grades' });
    Subject.hasMany(models.Schedule, { foreignKey: 'subjectId', as: 'schedules' });
  };

  return Subject;
};