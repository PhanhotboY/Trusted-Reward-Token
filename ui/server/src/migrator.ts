import { pgInstance } from "./db/init.postgresql";

if (require.main === module) {
  pgInstance.getMigrator().runAsCLI();
}
