module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    studentId: { type: DataTypes.UUID, allowNull: false },
    classId: DataTypes.UUID,
    date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM('present', 'absent', 'late', 'excused'), defaultValue: 'present' },
    justification: DataTypes.TEXT,
  }, {
    tableName: 'attendances',
    indexes: [{ unique: true, fields: ['student_id', 'date'] }],
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
    Attendance.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
  };

  return Attendance;
};