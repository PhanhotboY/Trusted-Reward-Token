import { BadRequestError } from "../core/errors";

const uuidv4Regex = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
);

function isUUIDv4(uuid: string): boolean {
  return uuidv4Regex.test(uuid);
}

function checkUUIDv4(uuid: string): void {
  if (!isUUIDv4(uuid)) throw new BadRequestError(`Invalid UUIDv4: ${uuid}`);
}

export { isUUIDv4, checkUUIDv4 };
