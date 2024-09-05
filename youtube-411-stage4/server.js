const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const morgan = require('morgan');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

app.disable('etag');



const connection = mysql.createConnection({
  host: '35.188.38.247',
  user: 'root',
  password: 'jEOY;e-CpS{K]E3X',
  database: 'YouTubeSearchPremium',
  multipleStatements: true
});
 /**
  * DB_HOST is the Primary IP when looking at the Google SQL Overview. 
  * DB_DATABASE is the database name you created earlier, 
  * DB_USER is the username
  * DB_PASS is the password.
  */
 function combineTags(arrayOfObjects) {
  return arrayOfObjects.reduce((accumulator, current, index) => {
    if (index === 0) {
      accumulator.tag_id = [];
      accumulator.tag_description = [];
    }

    accumulator.tag_id.push(current.tag_id);
    accumulator.tag_description.push(current.tag_description);

    if (index === 0) {
      Object.keys(current).forEach((key) => {
        if (key !== 'tag_id' && key !== 'tag_description') {
          accumulator[key] = current[key];
        }
      });
    }

    return accumulator;
  }, {});
}
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  console.log('Connected to database.');
});

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.get('/api/video/:videoId', (req, res) => {
  const { videoId } = req.params;
  connection.query('SELECT * FROM Videos v NATURAL JOIN Categories c NATURAL JOIN Video_Tags vt JOIN Tags t ON (vt.tag_id = t.tag_id) WHERE v.video_id = ?', videoId, (err, results) => {
    if (err) {
      console.error('Error getting video: ', err);
      res.status(500).send('Error getting video from database.');
    } else {
      if(results.length == 0) {
        connection.query('SELECT * FROM Videos v NATURAL JOIN Categories c WHERE v.video_id = ?', videoId, (err, result) => {
          res.send(result[0]);
        });
      } else {
        res.send(combineTags(results));
      }
    }
  });
});

app.get('/api/videos', (req, res) => {
  connection.query('SELECT * FROM Videos LIMIT 50', (err, results) => {
    if (err) {
      console.error('Error getting videos: ', err);
      res.status(500).send('Error getting videos from database.');
    } else {
      res.send(results);
    }
  });
});


//change & update /searchVideo with data analysis on each returned query
const analyzeDataInPython = (rows, callback) => {
  const pythonProcess = spawn('python3', ['analyze.py']);
  let result = '';

  pythonProcess.stdout.on('data', (rows) => {
    result += rows.toString(); //reading stream from stdout, parse the result to json string
  });

  pythonProcess.stderr.on('data', (rows) => {
    console.error(`Python error: ${rows}`);
  });

  pythonProcess.stdout.on('end', () => {
    callback(null, result); //parse the result at the end and exit this process, seemingly already a json
  });

  pythonProcess.on('error', (error) => {
    callback(error, null);
  });

  pythonProcess.stdin.write(JSON.stringify(rows));
  pythonProcess.stdin.end();
};


app.get('/api/searchVideo', async (req, res) => {
  const { videoName } = req.query;

  connection.query('SELECT * FROM Videos WHERE video_title LIKE ?', `%${videoName}%`, (err, rows) => {
    if (err) {
      console.error('Error searching videos: ', err);
      res.status(500).send('Error searching videos in database.');
      return;
    } 
    
    //can do if controlling return row number to avoid analyze on many rows
    analyzeDataInPython(rows, (err, anaresults) => {
      if(err) {
        console.error('Error in video analysis: ', err);
        res.status(500).send('Error analyzing videos in database.');
        return;
      }
      res.json({data: rows, analysis: anaresults}); //send the data to the client
    });
  });
});

app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM Users', (err, results) => {
    console.log('getting all users')
    if (err) {
      console.error('Error getting users: ', err);
      res.status(500).send('Error getting users from database.');
    } else {
      res.send(results);
    }
  });
});

app.post('/api/user/register', (req, res) => {
    const { userName, userEmail, password } = req.body;
    connection.query('INSERT INTO Users (user_name, user_email, user_password) VALUES (?, ?, ?); SELECT LAST_INSERT_ID();', [userName, userEmail, password], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error registering user');
      } else {
        res.status(200).send(result);
      }
    });
  });

app.post('/api/user/login', (req, res) => {
  const { userEmail, password } = req.body;
  connection.query('SELECT user_id, user_name FROM Users WHERE user_email = ? AND user_password = ?', [userEmail, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error logging in user');
    } else {
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(200).send('Invalid email or password');
      }
    }
  });
});

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params;
    connection.query('SELECT * FROM Users WHERE user_id = ?', userId, (err, results) => {
      if (err) {
        console.error('Error searching videos: ', err);
        res.status(500).send('Error searching videos in database.');
      } else {
        res.send(results);
      }
    });
  });

app.put('/api/user/:userId', (req, res) => {
    const { userId } = req.params;
    const { userName, userEmail } = req.body;
    connection.query('UPDATE Users SET user_name = ?, user_email = ? WHERE user_id = ?', [userName, userEmail, userId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error updating user information');
      } else {
        if (result.affectedRows > 0) {
          res.status(200).send('User information updated successfully');
        } else {
          res.status(404).send('User not found');
        }
      }
    });
  });

app.get('/api/user/:userId/favoriteVideo', (req, res) => {
    const { userId } = req.params;
    connection.query('SELECT * FROM Videos NATURAL JOIN Favorite_Videos WHERE Favorite_Videos.user_id = ?', userId, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error adding video to favorites');
      } else {
        res.status(200).send(result);
      }
    });
  });

app.post('/api/user/:userId/favoriteVideo', (req, res) => {
    const { userId } = req.params;
    const { videoId } = req.body;
    const currDate = new Date()
    connection.query('INSERT INTO Favorite_Videos (user_id, video_id, favorite_date) VALUES (?, ?, ?)', [userId, videoId, currDate], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error adding video to favorites');
      } else {
        res.status(200).send('Video added to favorites successfully');
      }
    });
  });

app.delete('/api/user/:userId/favoriteVideo/:videoId', (req, res) => {
    const { userId, videoId } = req.params;
    connection.query('DELETE FROM Favorite_Videos WHERE user_id = ? AND video_id = ?', [userId, videoId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error removing video from favorites');
      } else {
        if (result.affectedRows > 0) {
          res.status(200).send('Video removed from favorites successfully');
        } else {
            res.status(404).send('Error deleting video');
        }
      }
    });
  });
  app.get('/api/user/:userId/favoriteTag', (req, res) => {
    const { userId } = req.params;
    connection.query('SELECT * FROM Tags NATURAL JOIN Favorite_Tags WHERE Favorite_Tags.user_id = ?', userId, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error getting favorite tags');
      } else {
        res.status(200).send(result);
      }
    });
  });
  
  app.post('/api/user/:userId/favoriteTag', (req, res) => {
    const { userId } = req.params;
    const { tagId } = req.body;
    const currDate = new Date()
    connection.query('INSERT INTO Favorite_Tags (user_id, tag_id, favorite_date) VALUES (?, ?, ?)', [userId, tagId, currDate], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error adding tag to favorites');
      } else {
        res.status(200).send('Tag added to favorites successfully');
      }
    });
  });
  
  app.delete('/api/user/:userId/favoriteTag/:tagId', (req, res) => {
    const { userId, tagId } = req.params;
    connection.query('DELETE FROM Favorite_Tags WHERE user_id = ? AND tag_id = ?', [userId, tagId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error removing tag from favorites');
      } else {
        if (result.affectedRows > 0) {
          res.status(200).send('Tag removed from favorites successfully');
        } else {
          res.status(404).send('Error deleting tag');
        }
      }
    });
  });

app.get('/api/advancedQuery/video', (req, res) => {
    connection.query('SELECT video_title, video_id FROM Videos WHERE like_count > (SELECT AVG(like_count) FROM Videos) UNION SELECT video_title, video_id FROM Videos WHERE view_count > (SELECT AVG(view_count) FROM Videos) LIMIT 15;', (err, results) => {
      console.log('advanced query')
      if (err) {
        console.error('Error getting videos: ', err);
        res.status(500).send('Error getting videos from database.');
      } else {
        res.send(results);
      }
    });
  });
  app.get('/api/advancedQuery/tag', (req, res) => {
    connection.query('SELECT t.tag_description, COUNT(v.video_id) FROM Videos v NATURAL JOIN Video_Tags vt JOIN Tags t ON (vt.tag_id = t.tag_id) GROUP BY t.tag_id ORDER BY COUNT(v.video_id) DESC LIMIT 15;', (err, results) => {
      if (err) {
        console.error('Error getting videos: ', err);
        res.status(500).send('Error getting videos from database.');
      } else {
        res.send(results);
      }
    });
  });

  app.get('/api/getGlobalFavorite', (req, res) => {
    connection.query('CALL UpdateFavorites;SELECT * FROM Global_Favorites', (err, results) => {
      if (err) {
        console.error('Error getting videos: ', err);
        res.status(500).send('Error getting videos from database.');
      } else {
        res.send(results);
      }
    });
  })

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
