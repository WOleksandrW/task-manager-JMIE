const NAME_REGEX = new RegExp('^[A-Za-z]+$');
const EMAIL_REGEX = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = new RegExp(
  '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&_-])[A-Za-z\\d@$!%*#?&_-]{0,}$'
);

export default { NAME_REGEX, EMAIL_REGEX, PASSWORD_MIN_LENGTH, PASSWORD_REGEX };
