import { EventEmitter } from "events";
import process from "process";

Object.defineProperty(window, "EventEmitter", {
  value: EventEmitter,
});

Object.defineProperty(window, "process", {
  value: process,
});
