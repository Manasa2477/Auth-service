function Validatephno(phoneNumber) {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phoneNumber);
}

function Validatepin(pin) {
  const regex = /^\d{4}$/;
  return regex.test(pin);
}
function Validationemail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

module.exports = {
  Validatephno,
  Validatepin,
  Validationemail,
};
