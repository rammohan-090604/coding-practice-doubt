const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//get metehod
app.get("/players/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      cricket_team 
    ORDER BY
      player_id;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

//post
app.post("/players/", async (request, response) => {
  const bookDetails = request.body;
  const { player_id, player_name, jersey_number, role } = bookDetails;
  const addBookQuery = `
    INSERT INTO
    cricket_team
 ( player_id,
    player_name,
    jersey_number,
    role)
    VALUES
      (
        '${player_id}',
         ${player_name},
         ${jersey_number},
         ${role}
      );`;

  const dbResponse = await db.run(addBookQuery);
  const bookId = dbResponse.lastID;
  response.send({ player_id: bookId });
});

//update
app.put("/players/:playerId/", async (request, response) => {
  const { bookId } = request.params;
  const bookDetails = request.body;
  const { player_id, player_name, jersey_number, role } = bookDetails;
  const updateBookQuery = `
    UPDATE
      cricket_team
    SET
      player_id=${player_id},
      player_name=${player_name},
      jersey_number=${jersey_number},
      role=${role}
    WHERE
      player_id = ${bookId};`;
  await db.run(updateBookQuery);
  response.send("Player Details Updated");
});

//get player name
app.get("/players/:playerId/", async (request, response) => {
  const { bookId } = request.params;
  const getBookQuery = `
    SELECT
      *
    FROM
      cricket_team
    WHERE
      player_id = ${bookId};`;
  const book = await db.get(getBookQuery);
  response.send(book);
});

//delete
app.delete("/players/:playerId/", async (request, response) => {
  const { bookId } = request.params;
  const deleteBookQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${bookId};`;
  await db.run(deleteBookQuery);
  response.send("Player Removed");
});
