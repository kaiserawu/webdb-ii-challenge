const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

server.post('/api/zoos', (req, res) => {
  const zoo = req.body;

  if (!zoo.name) {
    return res.status(400).json({ error: 'Name was not supplied'});
  }

  db.insert(zoo)
    .into('zoos')
    .then(id => {
      res.status(201).json(id);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

server.get('/api/zoos', (req, res) => {
  db.select().from('zoos')
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    })
})

server.get('/api/zoos/:id', (req, res) => {
  const zooId = req.params.id;

  db.select().from('zoos')
    .where({ id: zooId })
    .then(data => {
      if (!data.length) {
        return res.status(404).json({ error: 'ID not found'});
      }
      res.json(data);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
