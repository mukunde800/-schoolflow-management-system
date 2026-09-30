module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    matricule: { type: DataTypes.STRING, unique: true },
    birthDate: DataTypes.DATEONLY,
    gender: DataTypes.ENUM('M', 'F'),
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    parentId: DataTypes.UUID,
    classId: DataTypes.UUID,
    enrollmentDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.ENUM('active', 'inactive', 'graduated'), defaultValue: 'active' },
    notes: DataTypes.TEXT,
  }, { tableName: 'students' });

  Student.associate = (models) => {
    Student.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Student.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Student.belongsTo(models.Parent, { foreignKey: 'parentId', as: 'parent' });
    Student.hasMany(models.Grade, { foreignKey: 'studentId', as: 'grades' });
    Student.hasMany(models.Attendance, { foreignKey: 'studentId', as: 'attendances' });
    Student.hasMany(models.Payment, { foreignKey: 'studentId', as: 'payments' });
    Student.hasMany(models.Enrollment, { foreignKey: 'studentId', as: 'enrollments' });
  };

  return Student;
};