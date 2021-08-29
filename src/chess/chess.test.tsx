import React from "react";
import { render, screen } from "@testing-library/react";
import Chess from "./chess";

test("renders learn react link", () => {
  render(<Chess />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
