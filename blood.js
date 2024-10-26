const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const PORT = 4000;

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Seokjin1992#',
    database: 'blood_donation'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/donor', (req, res) => {
    res.sendFile(__dirname + '/donor.html');
});
app.get('/recipient', (req, res) => {
    res.sendFile(__dirname + '/recipient.html');
});
app.get('/search', (req, res) => {
    res.sendFile(__dirname + '/search.html');
});

//

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
app.get('/page', (req, res) => {
    res.sendFile(__dirname + '/page.html');
});

//

app.get('/staff', (req, res) => {
    res.sendFile(__dirname + '/staff.html');
});
app.get('/inventory', (req, res) => {
    res.sendFile(__dirname + '/inventory.html');
});
app.get('/bloodtest', (req, res) => {
    res.sendFile(__dirname + '/bloodtest.html');
});

//


app.get('/update_donor', (req, res) => {
    res.sendFile(__dirname + '/update_donor.html');
});
app.get('/delete_donor', (req, res) => {
    res.sendFile(__dirname + '/delete_donor.html');
});
app.get('/update_recipient', (req, res) => {
    res.sendFile(__dirname + '/update_recipient.html');
});
app.get('/delete_recipient', (req, res) => {
    res.sendFile(__dirname + '/delete_recipient.html');
});
app.get('/update_staff', (req, res) => {
    res.sendFile(__dirname + '/update_staff.html');
});
app.get('/delete_staff', (req, res) => {
    res.sendFile(__dirname + '/delete_staff.html');
});
app.get('/update_inventory', (req, res) => {
    res.sendFile(__dirname + '/update_inventory.html');
});

//

app.get('/get_packets', (req, res) => {
    res.sendFile(__dirname + '/get_packets.html');
});
app.get('/get_staff', (req, res) => {
    res.sendFile(__dirname + '/get_staff.html');
});
app.get('/get_bloodtest', (req, res) => {
    res.sendFile(__dirname + '/get_bloodtest.html');
});

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/style.css');
});

app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/script.js');
});


app.post('/insertdonor', (req, res) => {
    const {donor_id, name, age, phone, email, gender, blood_type, allergies, address, donation_freq} = req.body;
    const donor = {donor_id, name, age, phone, email, gender, blood_type, allergies, address, donation_freq};

    const sql = 'INSERT INTO donor SET ?';
    connection.query(sql, donor, (err, result) => {
        if (err) {
            console.error('Error inserting donor into MySQL:', err);
            res.status(500).send('Error inserting user');
        } else {
            console.log('Donor inserted into MySQL:', result);
            res.redirect('/');
        }
    });
});

app.post('/insertrecipient', (req, res) => {
    const {recipient_id, r_name, r_age, r_phone, r_gender, r_blood_type, r_allergies, r_address} = req.body;
    const recipient = {recipient_id, r_name, r_age, r_phone, r_gender, r_blood_type, r_allergies, r_address};

    const sql = 'INSERT INTO recipient SET ?';
    connection.query(sql, recipient, (err, result) => {
        if (err) {
            console.error('Error inserting recipient into MySQL:', err);
            res.status(500).send('Error inserting user');
        } else {
            console.log('Recipient inserted into MySQL:', result);
        }
    });
});

app.post('/insertrecipientattributes', (req, res) => {
  const { recipient_id, attribute_id, attribute_value } = req.body;

  const query = `INSERT INTO recipient_attribute_values SET ?`;
  const values = {recipient_id, attribute_id, attribute_value};

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error('Error inserting values: ' + error.message);
      res.status(500).send('Error inserting values');
      return;
    }
    console.log('Inserted values successfully.');
  });
});



app.post('/findDonor', (req, res) => {
  const { blood_type, address } = req.body;

  console.log('Received request:', { blood_type, address });

  // Use parameterized query to avoid SQL injection
  const query = `SELECT name, blood_type, address, email FROM donor
    WHERE
       ( (? = 'A+' AND blood_type IN ('A+', 'A-', 'O+', 'O-')) OR
        (? = 'B+' AND blood_type IN ('B+', 'B-', 'O+', 'O-')) OR
        (? = 'AB+' AND blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')) OR
        (? = 'O+' AND blood_type IN ('O+', 'O-')) OR
        (? = 'A-' AND blood_type IN ('A-', 'O-')) OR
        (? = 'B-' AND blood_type IN ('B-', 'O-')) OR
        (? = 'AB-' AND blood_type IN ('A-', 'B-', 'AB-', 'O-')) OR
        (? = 'O-' AND blood_type IN ('O-'))
        )
    AND address = ?`
;
  const queryParams = [blood_type, blood_type, blood_type, blood_type, blood_type, blood_type, blood_type, blood_type, address];

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.json({ message: 'No matching donors found' });
    } else {
      res.json(results);
    }
  });
});




app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], async (err, result) => {
    if (err) {
      res.status(500).send('Error logging in');
    } else {
      if (result.length > 0) {
        res.status(200).send('Login successful');
      } else {
        res.status(401).send('Incorrect username or password');
      }
    }
  });
});



app.post('/update_donor', (req, res) => {
    console.log('POST request received');
    const donor_id = req.body.donor_id;
    const { name, age, address, phone, email } = req.body;
    console.log('Data received:', req.body);

    if (!name || !age || !address || !phone) {
        return res.status(400).json({ error: 'Invalid data provided' });
    }

    const updateDonorQuery = `
        UPDATE donor
        SET name = ?, age = ?, address = ?, phone = ?, email = ?
        WHERE donor_id = ?
    `;

    connection.query(updateDonorQuery, [name, age, address, phone, email, donor_id], (err, result) => {
        if (err) {
            console.error('Error updating donor:', err);
            res.status(500).json({ error: 'Error updating donor' });
        } else {
            console.log('Donor updated:', result);
            res.json({ message: 'Donor updated successfully' });
        }
    });
});

app.delete('/donor/:donor_id', (req, res) => {
  const donor_id = req.params.donor_id;

  const sql = 'DELETE FROM donor WHERE donor_id = ?';

  connection.query(sql, [donor_id], (err, results) => {
    if (err) {
      console.error('Error deleting donor: ' + err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Donor not found' });
      return;
    }

    res.status(200).json({ message: 'Donor deleted successfully' });
  });
});




app.post('/update_recipient', (req, res) => {
    console.log('POST request received');
    const recipient_id = req.body.recipient_id;
    const { r_name, r_age, r_address, r_phone } = req.body;
    console.log('Data received:', req.body);

    if (!r_name || !r_age || !r_address || !r_phone) {
        return res.status(400).json({ error: 'Invalid data provided' });
    }

    const updateRecipientQuery = `
        UPDATE recipient
        SET r_name = ?, r_age = ?, r_address = ?, r_phone = ?
        WHERE recipient_id = ?
    `;

    connection.query(updateRecipientQuery, [r_name, r_age, r_address, r_phone, recipient_id], (err, result) => {
        if (err) {
            console.error('Error updating recipient:', err);
            res.status(500).json({ error: 'Error updating recipient' });
        } else {
            console.log('recipient updated:', result);
            res.json({ message: 'recipient updated successfully' });
        }
    });
});

app.post('/update_recipient_attributes', (req, res) => {
    console.log('POST request received');
    const { recipient_id, attribute_id, attribute_value } = req.body;
    console.log('Data received:', req.body);

    if (!recipient_id || !attribute_id || !attribute_value) {
        return res.status(400).json({ error: 'Invalid data provided' });
    }
    const updateRecipientAttributesQuery = `
        UPDATE recipient_attribute_values
        SET attribute_value = ?
        WHERE recipient_id = ? AND attribute_id = ?
    `;
    connection.query(updateRecipientAttributesQuery, [attribute_value, recipient_id, attribute_id], (err, result) => {
        if (err) {
            console.error('Error updating recipient attributes:', err);
            res.status(500).json({ error: 'Error updating recipient attributes' });
        } else {
            console.log('Recipient attributes updated:', result);
            res.json({ message: 'Recipient attributes updated successfully' });
        }
    });
});


app.delete('/recipient/:recipient_id', (req, res) => {
  const recipient_id = req.params.recipient_id;

  const sql = 'DELETE FROM recipient WHERE recipient_id = ?';

  connection.query(sql, [recipient_id], (err, results) => {
    if (err) {
      console.error('Error deleting recipient: ' + err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'recipient not found' });
      return;
    }

    res.status(200).json({ message: 'recipient deleted successfully' });
  });
});


app.post('/insertstaff', (req, res) => {
    const {staff_id, s_name, s_phone, specialization, days} = req.body;
    const staff = {staff_id, s_name, s_phone, specialization, days};

    const sql = 'INSERT INTO staff SET ?';
    connection.query(sql, staff, (err, result) => {
        if (err) {
            console.error('Error inserting staff into MySQL:', err);
            res.status(500).send('Error inserting staff');
        } else {
            console.log('Staff inserted into MySQL:', result);
            res.redirect('/page');
        }
    });
});



app.post('/update_staff', (req, res) => {
    console.log('POST request received');
    const staff_id = req.body.staff_id;
    const {s_name, s_phone, specialization, days} = req.body;
    console.log('Data received:', req.body);

    if (!s_name || !s_phone|| !specialization || !days) {
        return res.status(400).json({ error: 'Invalid data provided' });
    }

    const updateStaffQuery = `
        UPDATE staff
        SET s_name = ?, s_phone = ?, specialization = ?, days = ?
        WHERE staff_id = ?
    `;

    connection.query(updateStaffQuery, [s_name, s_phone, specialization, days, staff_id], (err, result) => {
        if (err) {
            console.error('Error updating staff:', err);
            res.status(500).json({ error: 'Error updating staff' });
        } else {
            console.log('staff updated:', result);
            res.json({ message: 'staff updated successfully' });
        }
    });
});

app.delete('/staff/:staff_id', (req, res) => {
  const staff_id = req.params.staff_id;

  const sql = 'DELETE FROM staff WHERE staff_id = ?';

  connection.query(sql, [staff_id], (err, results) => {
    if (err) {
      console.error('Error deleting staff: ' + err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'staff not found' });
      return;
    }

    res.status(200).json({ message: 'staff deleted successfully' });
  });
});

app.post('/findStaff', (req, res) => {
    connection.query('SELECT * FROM staff ORDER BY days ASC', (error, results, fields) => {
        if (error) {
            console.error('Error retrieving staff details:', error);
            res.status(500).json({ error: 'Failed to retrieve staff details' });
        } else {
            res.json(results); 
        }
    });
});




app.post('/insertinventory', (req, res) => {
    const {packet_id, quantity_available, i_blood_type, expiration_date} = req.body;
    const inventory = {packet_id, quantity_available, i_blood_type, expiration_date};

    const sql = 'INSERT INTO inventory SET ?';
    connection.query(sql, inventory, (err, result) => {
        if (err) {
            console.error('Error inserting inventory into MySQL:', err);
            res.status(500).send('Error inserting inventory');
        } else {
            console.log('Inventory inserted into MySQL:', result);
            res.redirect('/page');
        }
    });
});



app.post('/update_inventory', (req, res) => {
    console.log('POST request received');
    const packet_id = req.body.packet_id;
    const {expiration_date, quantity_available} = req.body;
    console.log('Data received:', req.body);

    if (!expiration_date || !quantity_available) {
        return res.status(400).json({ error: 'Invalid data provided' });
    }

    const updateInventoryQuery = `
        UPDATE inventory
        SET expiration_date = ?, quantity_available = ?
        WHERE packet_id = ?
    `;

    connection.query(updateInventoryQuery, [expiration_date, quantity_available, packet_id], (err, result) => {
        if (err) {
            console.error('Error updating inventory:', err);
            res.status(500).json({ error: 'Error updating inventory' });
        } else {
            console.log('inventory updated:', result);
            res.json({ message: 'inventory updated successfully' });
        }
    });
});

app.post('/findPacket', (req, res) => {
  const {i_blood_type} = req.body;

  console.log('Received request:', { i_blood_type});
  const query = `SELECT packet_id, i_blood_type, quantity_available FROM inventory
    WHERE
       i_blood_type = ?`
;
  const queryParams = [i_blood_type];

  connection.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.json({ message: 'No matching packets found' });
    } else {
      res.json(results);
    }
  });
});





app.post('/insertbloodtest', (req, res) => {
    const { test_id, t_donor_id, test_date, haemoglobin, rbc_count, wbc_count, platelet_count, glucose, eligibility_check, doc_id } = req.body;
    const bloodtest = { test_id, t_donor_id, test_date, haemoglobin, rbc_count, wbc_count, platelet_count, glucose, eligibility_check, doc_id };

    const sql = 'INSERT INTO blood_test SET ?';
    connection.query(sql, bloodtest, (err, result) => {
        if (err) {
            console.error('Error inserting blood test into MySQL:', err);
            res.status(500).send('Error inserting blood test');
            return;
        }
        
        console.log('Blood test inserted into MySQL:', result);

        connection.query('SELECT eligibility_check FROM blood_test WHERE TEST_ID = ?', test_id, (error, results) => {
            if (error) {
                console.error('Error retrieving record:', error);
                res.status(500).send('Error retrieving blood test record');
                return;
            }

            const insertedEligibilityCheck = results[0].eligibility_check;
            const userEnteredEligibilityCheck = eligibility_check;

            if (userEnteredEligibilityCheck !== insertedEligibilityCheck) {
                console.log('Warning: The entered eligibility check does not match the value set by the trigger.');
            
                res.status(400).send('The entered eligibility check does not match the value set by the trigger.');
            } else {
            
                res.redirect('/page');
            }
        });
    });
});


app.post('/findBloodTest', (req, res) => {
    const {test_id} = req.body;

    console.log('Received request:', {test_id});

    if (!test_id) {
        return res.status(400).json({ error: 'Missing required field: test_id' });
    }

    const query = `
        SELECT blood_test.*, donor.*
        FROM blood_test
        INNER JOIN donor ON blood_test.t_donor_id = donor.donor_id
        WHERE blood_test.test_id = ?
    `;
    const queryParams = [test_id]; 

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No matching blood test found' });
        }

        res.json(results); 
    });
});




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});