import {ChatRepository} from "./chat-repository";

describe("ChatRepository", () => {
  it("should create an instance", () => {
    expect(new ChatRepository()).toBeTruthy();
  });
});
