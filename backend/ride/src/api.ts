import express from "express";
import AccountService from "./AccountService";
const app = express();

app.use(express.json());
const accountService = new AccountService();

app.post("/signup", async function (request, response) {
  const input = request.body;
  const output = await accountService.signup(input);
  response.json(output);
});

app.get("/accounts/:accountId", async function (request, response) {
  const output = await accountService.getAccount(request.params.accountId);
  response.json(output);
});

app.listen(3000);