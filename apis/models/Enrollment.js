module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define('Enrollment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    studentId: { type: DataTypes.UUID, allowNull: false },
    classId: { type: DataTypes.UUID, allowNull: false },
    academicYear: DataTypes.STRING,
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'), defaultValue: 'pending' },
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    notes: DataTypes.TEXT,
  }, { tableName: 'enrollments' });

  Enrollment.associate = (models) => {
    Enrollment.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    Enrollment.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
  };

  return Enrollment;
};