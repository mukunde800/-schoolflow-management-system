const { Grade, Student, Subject } = require('../src/models');

exports.getStudentReport = async (studentId) => {
  const student = await Student.findByPk(studentId, { include: ['user', 'class'] });
  if (!student) throw Object.assign(new Error('Étudiant introuvable'), { status: 404 });

  const grades = await Grade.findAll({
    where: { studentId },
    include: [{ association: 'subject' }],
  });

  const bySubject = grades.reduce((acc, g) => {
    const key = g.subject?.name || 'Inconnu';
    if (!acc[key]) acc[key] = { grades: [], total: 0, coef: 0 };
    acc[key].grades.push(g.value);
    acc[key].total += parseFloat(g.value) * g.coefficient;
    acc[key].coef += g.coefficient;
    return acc;
  }, {});

  const averages = Object.entries(bySubject).map(([subject, data]) => ({
    subject,
    average: data.coef ? (data.total / data.coef).toFixed(2) : 0,
    count: data.grades.length,
  }));

  const generalAvg = averages.length
    ? (averages.reduce((s, a) => s + parseFloat(a.average), 0) / averages.length).toFixed(2)
    : 0;

  return { student, averages, generalAvg };
};