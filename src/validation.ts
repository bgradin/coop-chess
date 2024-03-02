import fs from "fs";
import path from "path";
import { validate } from "jsonschema";
import { GameConfiguration } from "./game";
import { ClockMode } from "./clock";

const dtoFilePath = path.resolve(__dirname, "./dto.json");

if (!fs.existsSync(dtoFilePath)) {
  throw new Error("DTO file does not exist!");
}

const dto = JSON.parse(fs.readFileSync(dtoFilePath, "utf8"));
if (!dto.definitions) {
  throw new Error("Invalid DTO file!");
}

export function validateDto(dto: any, type: string): boolean {
  if (!dto.definitions[type]) {
    return false;
  }

  const result = validate(dto, dto.definitions[type]);
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
