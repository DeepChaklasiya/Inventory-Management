const validateIndianPhoneNumber = (phoneNumber: string): boolean => {
  const regex: RegExp = new RegExp(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/);
  return regex.test(phoneNumber);
};

function isEmptyObject(obj: Object) {
  return Object.keys(obj).length === 0;
}

export { validateIndianPhoneNumber, isEmptyObject };
