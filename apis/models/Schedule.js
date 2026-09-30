module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    classId: { type: DataTypes.UUID, allowNull: false },
    subjectId: { type: DataTypes.UUID, allowNull: false },
    teacherId: DataTypes.UUID,
    dayOfWeek: { type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'), allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    room: DataTypes.STRING,
  }, { tableName: 'schedules' });

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Class, { foreignKey: 'classId', as: 'class' });
    Schedule.belongsTo(models.Subject, { foreignKey: 'subjectId', as: 'subject' });
    Schedule.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'teacher' });
  };

  return Schedule;
};