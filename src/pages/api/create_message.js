import { getDatabase, closeDBInstance } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

const createMessage = async (db, queryParams, userId) => {
    console.log(queryParams);
    return new Promise((resolve, reject) => {
		const query = `INSERT INTO messages (user_id, name, display, message, address) VALUES(\'${userId}\', \'${queryParams.name}\', ${queryParams.display}, \'${queryParams.message}\', \'${queryParams.address}\')`;
        console.log(query);
        db.query(query, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    console.error("Error inserting message");
                    return reject(err);
                }
                return resolve();
            });
    });
}

export default async function handler(req, res) {
    const db = getDatabase();

    const userId = verifyJWT(req.headers["authorization"])
    if (userId === null) {
        res.status(401).json("Login token expired.");
        return;
    }
    
    try {
        await createMessage(db, req.query, userId);
        closeDBInstance(db);
        res.status(200).json("Successfully uploaded post");
    } catch (e) {
        closeDBInstance(db);
        console.error(e);
        res.status(400).json("Error uploading post");
    }
}
