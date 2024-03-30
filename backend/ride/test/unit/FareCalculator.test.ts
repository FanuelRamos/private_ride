import { FareCalculatorFactory } from "../../src/domain/FareCalculator";

test("Deve calcular o valor da tarifa com base na distância e no horário", function () {
  const distance = 10;
  const fare = FareCalculatorFactory.create(new Date("2022-01-01T10:00:00")).calculate(distance);
  expect(fare).toBe(21);
})