const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User')(sequelize, DataTypes);
const Student = require('./Student')(sequelize, DataTypes);
const Teacher = require('./Teacher')(sequelize, DataTypes);
const Parent = require('./Parent')(sequelize, DataTypes);
const Class = require('./Class')(sequelize, DataTypes);
const Subject = require('./Subject')(sequelize, DataTypes);
const Enrollment = require('./Enrollment')(sequelize, DataTypes);
const Grade = require('./Grade')(sequelize, DataTypes);
const Attendance = require('./Attendance')(sequelize, DataTypes);
const Payment = require('./Payment')(sequelize, DataTypes);
const Schedule = require('./Schedule')(sequelize, DataTypes);
const Announcement = require('./Announcement')(sequelize, DataTypes);
const Setting = require('./Setting')(sequelize, DataTypes);


const models = {
  User, Student, Teacher, Parent, Class, Subject,
  Enrollment, Grade, Attendance, Payment, Schedule, Announcement, Setting,
};

Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

module.exports = { sequelize, ...models };