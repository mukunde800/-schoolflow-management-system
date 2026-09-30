module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    studentId: { type: DataTypes.UUID, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    type: DataTypes.ENUM('inscription', 'scolarite', 'cantine', 'transport', 'autre'),
    status: { type: DataTypes.ENUM('pending', 'paid', 'overdue', 'cancelled'), defaultValue: 'pending' },
    dueDate: DataTypes.DATEONLY,
    paidDate: DataTypes.DATEONLY,
    method: DataTypes.ENUM('cash', 'card', 'transfer', 'mobile'),
    reference: DataTypes.STRING,
    notes: DataTypes.TEXT,
  }, { tableName: 'payments' });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Student, { foreignKey: 'studentId', as: 'student' });
  };

  return Payment;
};