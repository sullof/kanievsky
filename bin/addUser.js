#!/usr/bin/env node
const Auth = require("../server/lib/Auth");
const db = require("../server/lib/db");
const auth = new Auth(db);

const program = require("commander");

program
  .version("0.1.0")
  .option("-f, --force", "force the update of the password")
  .option("-u, --user [user]", "the user to be created")
  .option("-p, --pwd [pwd]", "the user's password")
  .parse(process.argv);

async function go(user, pwd) {
  let ok = program.force ? true : false;
  user = user.toLowerCase();
  if (!ok) {
    if (await auth.exist(user)) {
      console.info("User", user, "exists. Use -f to update the password.");
    } else {
      console.info("User", user, "does not exist yet.");
      ok = true;
    }
  }
  if (ok) {
    if ((await auth.signup(user, pwd)) === 0) {
      console.info("User", user, "has been created/updated.");
    } else {
      console.info("Wrong format for username");
    }
  }
  db.close();
}

if (program.user && program.pwd) {
  console.info("Working on", program.user);
  go(program.user.toLowerCase(), program.pwd);
}
