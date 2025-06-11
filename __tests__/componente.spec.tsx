import React from "react";
import { render } from "@testing-library/react-native";
import { Button } from "../src/components/button";

test("renderiza corretamente", () => {
  const { getByText } = render(<Button />);
  expect(getByText("Teste")).toBeTruthy();
});
