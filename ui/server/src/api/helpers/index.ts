const uuidv4Regex = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
);

function isUUIDv4(uuid: string): boolean {
  return uuidv4Regex.test(uuid);
}

export { isUUIDv4 };
