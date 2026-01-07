import { test, expect } from "bun:test";
import { extractContent } from "../app/utils/parser";

test("extractContent - simple tokens", () => {
  expect(extractContent("echo a b")).toEqual({
    command: "echo",
    args: ["a", "b"],
  });
});

test("extractContent - double quotes", () => {
  expect(extractContent(`echo "a b" c`)).toEqual({
    command: "echo",
    args: ["a b", "c"],
  });
});

test("extractContent - single quotes literal", () => {
  expect(extractContent("echo 'a b' c")).toEqual({
    command: "echo",
    args: ["a b", "c"],
  });
});

test("extractContent - backslash escapes outside quotes", () => {
  expect(extractContent("echo a\\ b c")).toEqual({
    command: "echo",
    args: ["a b", "c"],
  });
});

test("extractContent - empty input", () => {
  expect(extractContent("")).toEqual({ command: "", args: [] });
});
