const http = require('http');
const url = require('url');
const mysql = require('mysql');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydatabase',
};


const pool = mysql.createPool(dbConfig);


const server = http.createServer((req, res) => {
 
  if (req.method === 'POST' && req.url === '/submit-form') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const formData = new URLSearchParams(body);

      const name = formData.get('name');
      const email = formData.get('email');
      const phoneNumber = formData.get('phoneNumber');

     
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting MySQL connection:', err);
          res.statusCode = 500;
          res.end('Internal Server Error');
          return;
        }

        // Insert form data into the database
        const sql = `INSERT INTO formdata (name, email, phoneNumber) VALUES (?, ?, ?)`;
        connection.query(sql, [name, email, phoneNumber], (err) => {
          connection.release(); // Release the connection back to the pool

          if (err) {
            console.error('Error saving form data:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
          } else {
            console.log('Form data saved successfully');
            res.statusCode = 200;
            res.end('Form data saved successfully');
          }
        });
      });
    });
  } else {
    // Return a 404 Not Found for other routes
    res.statusCode = 404;
    res.end('Not Found');
  }
});

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
