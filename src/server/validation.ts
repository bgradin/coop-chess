import fs from "fs";
import path from "path";
import { Validator } from "jsonschema";
import { GameConfiguration } from "../game";
import { ClockMode } from "../clock";

const dtoFilePath = path.resolve(__dirname, "../dto.json");

if (!fs.existsSync(dtoFilePath)) {
  throw new Error("DTO file does not exist!");
}

const schema = JSON.parse(fs.readFileSync(dtoFilePath, "utf8"));
if (typeof schema.definitions !== "object") {
  throw new Error("Invalid DTO file!");
}

const validator = new Validator();
validator.addSchema(schema);

export function validateDto(dto: any, type: string): boolean {
  if (!schema.definitions[type]) {
    return false;
  }

  const result = validator.validate(dto, schema.definitions[type]);
  return result.valid;
}

export function validateInteger(value: number): boolean {
  return Math.floor(value) === value;
}

export function validateClock(config: GameConfiguration): boolean {
  if (!validateInteger(config.limit)) {
    return false;
  }

  if (config.clockMode === ClockMode.Live) {
    return typeof config.increment === "number"
      && validateInteger(config.increment);
  }

  return true;
}

export function validateConfig(config: GameConfiguration): boolean {
  return validateDto(config, "GameConfigurationDto") && validateClock(config);
}
