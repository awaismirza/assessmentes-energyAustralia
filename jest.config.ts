import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node'
}

export default config;

