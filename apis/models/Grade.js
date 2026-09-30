module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define('Grade', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    studentId: { type: DataTypes.UUID, allowNull: false },
    subjectId: { type: DataTypes.UUID, allowNull: false },
    teacherId: DataTypes.UUID,
    value: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    coefficient: { type: DataTypes.INTEGER, defaultValue: 1 },
    type: DataTypes.ENUM('devoir', 'examen', 'interrogation', 'tp'),
    semester: DataTypes.INTEGER,
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    comment: DataTypes.TEXT,
  }, { tableName: 'grades' });

  Grade.associate = (models) => {
    Grade.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    Grade.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    Grade.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'teacher' });
  };

  return Grade;
};